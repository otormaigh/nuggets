---
layout: post
title: Room Migration - Indices
date: 2020-09-13
tags:
  - android
  - room
---

Admittedly, even at the best of times, my SQL(SQLite)-fu isn't all that great, but it's improving as time goes on. With Room, to a degree some of the raw commands are abstracted away from you so that you don't fully have to worry about it. But this comes with a price, and one that isn't obvious until you have the good fortune of bumping into it. One area where this raised its head for me recently was when writing a migration to update the definition of a Room `Entity`. Even though it all looked OK, the app kept on crashing and crashing, I kept going over and over the stacktrace and the migration commands to see where I was going wrong, but I couldn't figure out what was the problem.

Take the following `Entity` as a starting point:
```kotlin
@Entity(
  tableName = "user",
  indices = [Index(value = ["last_name"])]
)
data class User(
  @PrimaryKey
  val id: Long,
  @ColumnInfo(name = "first_name")
  val firstName: String,
  @ColumnInfo(name = "last_name")
  val lastName: String
```

Now, imagine you get handed a new requirement saying that the `id` field here needs to be a `string` type rather than `Long`. OK, that's relatively straight forward you think, I just need to create a backup table, copy over the old data, drop the old table and then rename the new one to the correct name, something like this should do it:

```kotlin
val MIGRATION_1_2 = object : Migration(1, 2) {
  override fun migrate(database: SupportSQLiteDatabase) {
    database.execSQL("""
      CREATE TABLE user_backup(
        id TEXT PRIMARY KEY NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL
      )
    """)
    database.execSQL("""
      INSERT INTO user_backup(id, first_name, last_name)
      SELECT id, first_name, last_name FROM user
    """)
    database.execSQL("DROP TABLE user")
    database.execSQL("ALTER TABLE user_backup RENAME TO user")
  }
}
```

Easy peasy. Let's give that a run to be sure it works. Building...Deploying...Open the app up...CRASH. Um, excuse me, what? The stacktrace tells us this:

```
java.lang.IllegalStateException: Migration didn't properly handle: user(ie.otormaigh.migration.data.model.database.User).
  Expected:
TableInfo{name='user', columns={id=Column{name='id', type='TEXT', affinity='2', notNull=true, primaryKeyPosition=1, defaultValue='null'}, first_name=Column{name='first_name', type='TEXT', affinity='2', notNull=true, primaryKeyPosition=0, defaultValue='null'}, last_name=Column{name='last_name', type='TEXT', affinity='2', notNull=true, primaryKeyPosition=0, defaultValue='null'}}, foreignKeys=[], indices=[Index{name='index_user_last_name', unique=false, columns=[last_name]}]}
  Found:
TableInfo{name='user', columns={id=Column{name='id', type='TEXT', affinity='2', notNull=true, primaryKeyPosition=1, defaultValue='null'}, first_name=Column{name='first_name', type='TEXT', affinity='2', notNull=true, primaryKeyPosition=0, defaultValue='null'}, last_name=Column{name='last_name', type='TEXT', affinity='2', notNull=true, primaryKeyPosition=0, defaultValue='null'}}, foreignKeys=[], indices=[]}
```

For those that know what it looks like, the solution here is probably obvious (it will be to future me), but I'd never seen that before so I didn't entirely understand why the 'Found' output was missing the `indices` array values that the 'Expected' output had. After some digging I found out that I was missing a line in the migration commands to explicitly include the `Index` that was being added in the `@Entity` annotation above the `data class`. Which looks like this:

```kotlin
database.execSQL("CREATE INDEX IF NOT EXISTS index_user_last_name ON user (last_name)")
```

Building...Deploying...Open the app up...No crash...Hold for applause...Roll curtains.

That was it, that's all that was missing. I'll certainly not forget to do that next time, or at least now I'll know what it means when I see that stacktrace.

One other thing to note here; you might notice the name of the index that's being added to the table, it's getting appended with `index_user_` but I haven't explicitly given it that name anywhere within the `Entity` annotation or anywhere else, so where is it coming from? This is another thing that gets hidden by those handy abstractions Room that might catch you out, take a look at the docs [[1]] to see what's going on here.

[1]: https://developer.android.com/reference/androidx/room#name()
