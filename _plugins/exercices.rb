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

  class HelpBlock < Liquid::Block
    def render(context)
      text = super
      output = '
      <div class="card border-warning mb-3">
        <div class="card-header">
            <button class="btn btn-link" type="button" onclick="toggleNext(this)">
                Aide
            </button>
        </div>
        <div class="collapse hide">
            <div class="card-body">
              <p>'
      output += "#{text}"
      output += '
          </p>
          </div>
        </div>
      </div>'
    end
  end
end

Liquid::Template.register_tag('answer', Jekyll::ReplyBlock)
Liquid::Template.register_tag('correction', Jekyll::CorrectionBlock)
Liquid::Template.register_tag('help', Jekyll::HelpBlock)