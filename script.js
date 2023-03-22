if(!window.Article2Pdf){
    window.Article2Pdf = (function (){
        //${websiteurl}?${utm}
        //
        //
        let LOGO_LINK_CLASS = "pdf-logo-link";
        let LOGO_IMG_CLASS = "logo-img";
        let CTA_LINK_CLASS = "signup-button-link";
        let WATERMARK_CLASS = "watermark";
        let MAIN_ARTICLE_CONTAINER_CLASS = "main-article-content";

        let defaultOptions = {
           templateUrl : "",
           containerSelector : "body",
           logoLink: "",
           logoImg:"",
           ctaLink:"",
           ctaText:"",
           watermarkImg:"",
           getHtml:()=>{}
        };
        let options = {...defaultOptions};
        let articleMarkup;

        function wait(ms) {
            return function(response) {
                return new Promise(resolve => setTimeout(() => resolve(response), ms));
            };
        }
        function loadScript(url){
            const body = document.body;
            const script = document.createElement('script');
            script.innerHTML = '';
            script.src = url;
            script.async = false;
            script.defer = true;
            body.appendChild(script);
            return script
        }
        function addTemplate(){
           return fetch(options.templateUrl).then( res => res.text()).then( html => {
              let container = document.querySelector(options.containerSelector);
              if(container && typeof options.getHtml == "function")
              {
                  articleMarkup = options.getHtml();
                  container.innerHTML = html;
              }
           }).then(wait(100));
        }
        function getHtml2Pdf(){
            return new Promise((resolve,reject)=>{
                loadScript("https://testbook.com/question-answer/components/assets/js/html2pdf.bundle.min.js").addEventListener('load', () => {
                    resolve();
                });
            })
        }
        function addValues(){
           let logoLink = document.querySelector(`.${LOGO_LINK_CLASS}`);
           if(logoLink && options.logoLink){
               logoLink.href = options.logoLink;
           }
           let logoImg = document.querySelector(`.${LOGO_IMG_CLASS}`);
           if(logoImg && options.logoImg){
               logoImg.src = options.logoImg;
           }
           let ctaLink = document.querySelector(`.${CTA_LINK_CLASS}`);
           if(ctaLink && options.ctaLink){
               ctaLink.href = options.ctaLink;
               ctaLink.innerText = options.ctaText;
           }
           if(options.watermarkImg){
               document.querySelectorAll(`.${WATERMARK_CLASS}`).forEach( (element)=>{
                   element.style = `background-image:url('${options.watermarkImg}');`
               })
           }
           let article = document.querySelector(`.${MAIN_ARTICLE_CONTAINER_CLASS}`);
           if(article && articleMarkup){
               article.innerHTML = articleMarkup;
           }
        }

        function init(_options){
            options = {...defaultOptions,..._options};
            return new Promise((resolve)=>{
                Promise.all([
                    addTemplate().then(() => addValues()),
                    getHtml2Pdf()
                ]).then(wait(100)).then(()=>{
                    var opt = {
                        filename: document.title + '.pdf',
                        html2canvas:  {
                            scale: 2,
                            dpi: 300,
                            allowTaint : false,
                            useCORS: true
                        },
                        pagebreak: { avoid: ['tr','img', 'p', 'a', 'li'], mode: 'legacy' }
                    };
                    html2pdf(document.getElementById("pdfSegment"), opt).then(function() {
                        resolve();
                    });
                });
            });
        }
        return { init : init};
    })();
}
