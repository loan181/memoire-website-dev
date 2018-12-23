# Source https://blog.sverrirs.com/2016/04/custom-jekyll-tags.html
# Source 2 : https://blog.sverrirs.com/2016/04/custom-jekyll-tags.html
module Jekyll
  class ReplyBlock < Liquid::Block
    def render(context)
      text = super
      output = '
      <div class="card border-primary mb-3">
        <div class="card-header">Réponse</div>
        <div class="card-body text-primary">'
      output += "#{text}"
      output += '
          </div>
        </div>
      '
    end
  end

  class CorrectionBlock < Liquid::Block
    def render(context)
      text = super
      output = '
      <div class="card border-success mb-3 onlyTeacher">
        <div class="card-header">Correction</div>
        <div class="card-body text-success">
          <p class="card-text">'
      output += "#{text}"
      output += '
          </p>
          </div>
        </div>
      '
    end
  end
end
Liquid::Template.register_tag('answer', Jekyll::ReplyBlock)
Liquid::Template.register_tag('correction', Jekyll::CorrectionBlock)