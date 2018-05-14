var Post = can.Model.extend({
  findAll: 'GET http://public-api.wordpress.com/rest/v1/sites/idcdistro.wordpress.com/posts/',
}, {});


can.Component.extend({
  tag: 'can-post',
  view: `
    <h1>{{title}}</h1>
    <p>{{description}}</p>
  `,
  ViewModel: {
    title: {
      default: 'Hello world'
    },
    description: {
      default: 'Lorem ipsum dolor sit amet.'
    }
  }
});