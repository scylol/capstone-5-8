let URL = 'https://safe-earth-98661.herokuapp.com/items';
// let URL = 'http://localhost:8080/items';


function render(){
  let html = '';
  return fetch(URL)
  .then(res => res.json())
  .then(res => {
    res.forEach(function(item){
      let shortContent = item.content;
      if (item.content.length > 250){
        shortContent = item.content.substr(0, 250)+'<span>...</span>';
      }
      html += 
`<li class = 'item' id = '${item.id}'>
<div class = 'main-container'>
  <div class='header-container'>
    <p class = 'title'>${item.title}</p>
    <h3 class = 'subject'>${item.subject}</h3>
  </div>
  <div class='content-container'>
    <p class = 'author'>Author: ${item.author}</p>
    <p class = 'credentials'>Credentials: ${item.credentials}</p>
    <p class = 'truncated-content'>${shortContent}</p>
    <p class = 'full-content hidden'>${item.content}</p>
  </div>
  <div class ='controls-container'>
    <button class = 'read-more'>Read More</button>
    <button class = 'read-more hidden'>Read Less</button>
    <button class = "edit-button" type="button"> Edit </button>
  </div>
</div>
  
<form class = 'edit-form hidden'>
  <label>
    Title<br> <input class='edit-title' type="text" name = 'content' value = '${item.title}'><br>
  </label>
  <label>
    Subject<br> <input class='edit-subject' type="text" name = 'content' value = '${item.subject}'><br>
    </label>
    <label>
    Credentials<br> <input class='edit-credentials' type="text" name = 'content' value = '${item.credentials}'><br>
    </label>
    <label>
    Content<br> <textarea rows='10' cols='80' class='edit-content' type="text" name = 'content'>${item.content}</textarea><br>
    </label>
    <input class='edit-submit' type="submit" value="Submit">
    <button class = "delete-submit" type="button"> Delete </button>
  <button class = "edit-cancel" type="button"> Cancel </button>

</form>
</li>`;
    });
    return res;
  })
    .then((res)=>{
      $('.containerJS').html(html); 
      $('.containerJS').find('li').each(function(){
        if ($(this).find('.full-content').text().length < 250){
          $(this).find('.read-more').remove();
        }
      });
      return res;
    })
    .catch(err => console.error(err));
}

function deleteItemById(id){
  return fetch(`${URL}/${id}`, {
    method: 'DELETE',
  });
}


function postItem(){
  return fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      subject: $('#subject-input').val(),
      author: $('#author-input').val(),
      credentials: $('#credentials-input').val(),
      title: $('#title-input').val(),
      content: $('#content-input').val()
    })
  }).then( (res) => {
    return res.json();
  })
  .catch(err => console.error(err));
}

function updateItemById(id, thisBody){
  let thisURL = `${URL}/${id}`;
  return fetch(thisURL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(thisBody)
  })
  .then((res) => {
    return res.json();
  })
  .catch(err => console.error(err));
}

$(document).ready(function(){
  
  render();

  $('#submit-form').on('submit', function(event){
    event.preventDefault();
    return postItem()
      .then(() =>{
        render();
      })
      .catch(err => console.error(err));
  });

  $('.containerJS').on('click', '.delete-submit', function(){
    let thisId = $(this).closest('li').attr('id');
    return deleteItemById(thisId)
      .then(() =>{
        render();
      })
      .catch(err => {
        console.error(err);
      }); 
  });

  $('.containerJS').on('click', '.edit-button', function(){
    $(this).closest('li').find('.main-container').addClass('hidden');
    $(this).closest('li').find('.edit-form').removeClass('hidden');
  });

  $('.containerJS').on('click', '.edit-cancel', function(){
    $(this).closest('li').find('.main-container').removeClass('hidden');
    $(this).closest('li').find('.edit-form').addClass('hidden');
  });

  $('.containerJS').on('submit', '.edit-form', function(event){
    event.preventDefault();
    let thisId = $(this).closest('li').attr('id');
    let updateBody = {
      id: thisId,
      subject: $(this).find('.edit-subject').val(),
      author: $(this).find('.edit-author').val(),
      credentials: $(this).find('.edit-credentials').val(),
      title: $(this).find('.edit-title').val(),
      content: $(this).find('.edit-content').val()
    };
   
    updateItemById(thisId, updateBody)
      .then(() =>{
        render();
      })
      .catch(err =>{
        console.error(err);
      }); 
  });

  $('.containerJS').on('click', '.read-more', function(event){
    event.preventDefault();
    $(this).closest('li').find('.full-content').toggleClass('hidden');
    $(this).closest('li').find('.truncated-content').toggleClass('hidden');
    $(this).closest('li').find('.read-more').toggleClass('hidden');
  });
});
