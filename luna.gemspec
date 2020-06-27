# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "luna"
  spec.version       = "0.1.0"
  spec.authors       = ["Elliot Tormey"]
  spec.email         = ["elliot.tormey@gmail.com"]

  spec.summary       = "A plain and simple theme. No mess, no fuss."
  spec.homepage      = "https://github.com/otormaigh/luna-jekyll"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README|_config\.yml)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.1"
end
