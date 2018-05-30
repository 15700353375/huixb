
/*
 * @Author:      changh
 * @DateTime:    2018-05-25
 * @Description: 点击空白消失弹窗
 */

import $ from "jquery";

//SelevtVue
$(document).on('click', function (e) {
    let $target = $(e.target);
    let $parent = $target.closest('.selectVue');
    if ($parent.length){
      if($target.hasClass('caretBottom') || $target.hasClass('caretSpan')){
        $parent.find('input').first().focus();
      }
      let id = $parent.find(".dropdownMenu")[0].id;
      $('.dropdownMenu').hide();
      $(`#${id}`).show();
      e.stopPropagation();
      return false
    };

    $('.dropdownMenu').hide();
    e.stopPropagation();
});

//CascadeVue
$(document).on('click', function (e) {
    // debugger
    let $target = $(e.target);
    let $parent = $target.closest('.cascadeVue');
    if ($parent.length){
      if($target.hasClass('caretBottom') || $target.hasClass('caretSpan')){
        $parent.find('input').first().focus();
      }
      let id = $parent.find(".ulDiv")[0].id;
      $('.ulDiv').hide();
      $(`#${id}`).show();
      e.stopPropagation();
      return false
    };
    $('.ulDiv').hide();
    e.stopPropagation();
});

//DropdownVue
$(document).on('click', function (e) {
    let $target = $(e.target);
    let $parent = $target.closest('.DropdownVue');
    if ($parent.length){
      $('.dropdownMenuVue').show();
      e.stopPropagation();
      return false
    };
    $('.dropdownMenuVue').hide();
    e.stopPropagation();
});
