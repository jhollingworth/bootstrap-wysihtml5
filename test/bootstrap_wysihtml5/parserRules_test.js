if (wysihtml5.browser.supported()) {

      var colors = { silver: 1, gray: 1, white: 1, maroon: 1, red: 1, purple: 1,
		     fuchsia: 1, green: 1, lime: 1, olive: 1, yellow: 1, navy: 1,
		     blue: 1, teal: 1, aqua: 1, orange: 1 };

      var colorText = '';
      for(c in colors) {
	colorText = colorText + '<span class="wysiwig-color-' + c + '">' + c + '</span>';
      }


  module("wysihtml5.bootstrap.parserRules", {
    setup: function() {
      wysihtml5.dom.insertCSS([
        "#wysihtml5-test-textarea { width: 200px; height: 100px; margin-top: 5px; font-style: italic; border: 2px solid red; border-radius: 2px; }",
        "#wysihtml5-test-textarea:focus { margin-top: 10px; }"
      ]).into(document);

      this.textareaElement        = document.createElement("textarea");
      this.textareaElement.id     = "wysihtml5-test-textarea";
      this.textareaElement.title  = "Please enter your foo";
      this.textareaElement.value  = "hey tiff, what's up?";

      this.form = document.createElement("form");
      this.form.onsubmit = function() { return false; };
      this.form.appendChild(this.textareaElement);

      this.originalBodyClassName = document.body.className;

      document.body.appendChild(this.form);

      this.colors = { silver: 1, gray: 1, white: 1, maroon: 1, red: 1, purple: 1,
		     fuchsia: 1, green: 1, lime: 1, olive: 1, yellow: 1, navy: 1,
		     blue: 1, teal: 1, aqua: 1, orange: 1 };
      this.colorText = '';
      for(c in this.colors) {
	this.colorText = this.colorText + '<span class="wysiwyg-color-' + c + '">' + c + '</span>';
      };

    },

    teardown: function() {
      var leftover;
      while (leftover = document.querySelector("iframe.wysihtml5-sandbox, input[name='_wysihtml5_mode']")) {
        leftover.parentNode.removeChild(leftover);
      }
      this.form.parentNode.removeChild(this.form);
      document.body.className = this.originalBodyClassName;
    },

    getComposerElement: function() {
      return this.getIframeElement().contentWindow.document.body;
    },

    getIframeElement: function() {
      var iframes = document.querySelectorAll("iframe.wysihtml5-sandbox");
      return iframes[iframes.length - 1];
    }
  });


  asyncTest("check that he default parser rules work as expected", function() {
    expect(6);

    var that = this;

    $(this.textareaElement).wysihtml5();
    var editor = $(this.textareaElement).data('wysihtml5').editor;

    editor.observe("load", function() {

      equal(editor.parse("hello <b>foo</b>!").toLowerCase(), "hello <b>foo</b>!", "<b></b> tags are allowed");

      equal(editor.parse(that.colorText).toLowerCase(), that.colorText, 'classes used for font colors are allowed');

      equal(editor.parse("hello <strong>foo</strong>!").toLowerCase(), "hello foo!", "<strong></strong> tags are stripped out");

      equal(editor.parse("hello <faketag>foo</faketag>!").toLowerCase(), "hello foo!", "unrecognized tags are stripped out");

      equal(editor.parse('hello <a href="http://seospammer.com">spam</a>!').toLowerCase(),
	    'hello <a target="_blank" rel="nofollow" href="http://seospammer.com">spam</a>!',
	    '<a></a> tags have target="_blank" and rel="nofollow" attributes added');

      equal(editor.parse('standard internet image: <img width="foo" height="50px" src="cdn0.sbnation.com/imported_assets/155249/kitties.jpg">').toLowerCase(),
	    'standard internet image: <img alt="" height="50">',
	    '<img> tags have alt attribute added, strip out non-numeric characters in width/height, require fully-qualified url in src');

      start();
    });
  });

  asyncTest("check that parserRules passed in as options work properly", function() {
    expect(6);

    var that = this;

    $(this.textareaElement).wysihtml5('deepExtend', {
      parserRules: {
	classes: {
	  bar: 1,
          spanner: 1
	},
	tags: {
	  strong: 1,
	  blink: 1,
	  em: { rename_tag: "blink" },
	  span: {}
	}
      }
    });
    var editor = $(this.textareaElement).data('wysihtml5').editor;

    editor.observe("load", function() {

      equal(editor.parse("hello <b>foo</b>!").toLowerCase(), "hello <b>foo</b>!", "<b></b> tags are still allowed");

      equal(editor.parse('hello <span class="spanner">foo</span>!').toLowerCase(), 'hello <span class="spanner">foo</span>!', "<span></span> tags are allowed")

      equal(editor.parse(that.colorText).toLowerCase(), that.colorText, 'classes used for font color are still allowed');

      equal(editor.parse("hello <strong>foo</strong>!").toLowerCase(), "hello <strong>foo</strong>!", "<strong></strong> tags are allowed");

      equal(editor.parse('hello <i class="bar">foo</i>!').toLowerCase(), 'hello <i class="bar">foo</i>!', '<i class="bar"> survives');

      equal(editor.parse("hello <em>foo</em>!").toLowerCase(), "hello <blink>foo</blink>!", "<em></em> tags are converted to <blink></blink>");

      start();
    });
  });
}
