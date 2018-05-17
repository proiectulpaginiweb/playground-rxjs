import './index.less';

const ViewModule = (function() {
  function ApplicationView() {}
  ApplicationView.prototype.render = function() {
    let content = document.createElement('div');
    content.id = 'wrapper';

    return content;
  };

  function PostView(post) {
    this.post = new ModelModule.Post(post);
  }

  PostView.prototype.render = function() {
    const template = `
      <div class="content">
        <h1>${this.post.title}</h1>
        
        ${this.post.content}
      </div>
  
      <div class="metadata">
        <div class="details">
          <span>by ${this.post.author.first_name} ${this.post.author.last_name}</span>
          <span>${this.post.date.toLocaleDateString()}</span>
        </div>
    
        <div class="links">
          <a href="${this.post.URL}">More details</a>
        </div>
      </div>
    `;

    const el = document.createElement('div');
    el.classList.add('post');
    el.innerHTML = template;

    return el;
  };

  return {
    ApplicationView: ApplicationView,
    PostView: PostView
  };
})();

const ServiceModule = (function() {
  function PostService() {

  }

  PostService.prototype.retrieveAll = function() {
    return fetch('https://public-api.wordpress.com/rest/v1/sites/idcdistro.wordpress.com/posts/');
  };

  return {
    PostService: PostService
  };
})();

const ModelModule = (function() {
  function Post(post) {
    this.post = post;

    this.title = post.title;

    this.author = {
      first_name: post.author.first_name,
      last_name: post.author.last_name
    };

    this.content = post.content;

    this.date = new Date(Date.parse(post.date));

    this.URL = post.URL;
  }

  return {
    Post: Post
  };
})();

const ControllerModule = (function() {
  function PostController() {
    this.posts = [];
    this.postService = new ServiceModule.PostService();
    this.renderedItems = 0;
  }

  PostController.prototype.index = function(applicationContext) {
    const self = this;

    return this.postService.retrieveAll().then(
      function (response) {
        if (response.status !== 200) {
          console.error('Status Code:', response.status);
          return;
        }

        response.json().then(function (data) {
          data.posts.forEach(function (post) {
            self.posts.push(new ModelModule.Post(post));
          });

          // render stuff
          self.posts.forEach((el, i) => {
            if (i < 10) {
              let view = new ViewModule.PostView(el);

              applicationContext.appendChild(view.render());

              self.renderedItems++;
            }
          });

          // i couldn't find a way of paginating from the API so i did this
          window.onscroll = function (e) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
              self.posts.forEach((el, i) => {
                if (i >= self.renderedItems) {
                  let view = new ViewModule.PostView(el);

                  applicationContext.appendChild(view.render());

                  self.renderedItems++;
                }
              });
            }
          };
        });
      }
    ).catch(function (err) {
      console.error('Fetch Error', err);
    });
  };

  function ApplicationController() {
    this.postController = new ControllerModule.PostController();
    this.applicationView = new ViewModule.ApplicationView();
    this.applicationContext = this.applicationView.render();

    this.init();
  }

  ApplicationController.prototype.init = function () {
    document.body.appendChild(this.applicationContext);

    this.postController.index(this.applicationContext);
  };

  return {
    PostController: PostController,
    ApplicationController: ApplicationController
  };
})();

const Application = new ControllerModule.ApplicationController();