# Source https://blog.sverrirs.com/2016/04/custom-jekyll-tags.html
# Source 2 : https://blog.sverrirs.com/2016/04/custom-jekyll-tags.html
module Jekyll
  class BlocklyBlockTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
      output = "<img src=\""
      output += "/static/img/blocklyBlocks/"
      output += "#{@text}".strip
      output += ".svg\" class=\"img-fluid\">"
    end
  end
end

Liquid::Template.register_tag('blockly_block', Jekyll::BlocklyBlockTag)