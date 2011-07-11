var prim, model, view, router, collection, dom, cxt, text, check, radio, select, span, button, email, submit;

$(function() {
    prim = BKVO({});
    model = BKVO(new Backbone.Model);
    view = BKVO(new Backbone.View);
    router = BKVO(new Backbone.Router);
    collection = BKVO(new Backbone.Collection);
    dom = BKVO(document.getElementById('text-input'));

    cxt = $('#qunit-fixture');

    text = BKVO('[type=text]', cxt);
    check = BKVO('[type=checkbox]', cxt);
    radio = BKVO('[type=radio]', cxt);
    select = BKVO('select', cxt);
    span = BKVO('span', cxt);
    button = BKVO('button', cxt);
    email = BKVO('[type=email]', cxt);
    submit = BKVO('[type=submit]', cxt);
});

module('Utilities');

test('object types', function() {
	expect(8);

    equals(text.type, BKVO.types.jquery, 'jQuery object');
    equals(BKVO('input').type, BKVO.types.jquery, 'jQuery object (selector)');
    equals(dom.type, BKVO.types.jquery, 'DOM element');
	equals(prim.type, BKVO.types.evented, 'a plain object');
    equals(view.type, BKVO.types.view, 'Backbone view');
    equals(router.type, BKVO.types.router, 'Backbone router');
    equals(model.type, BKVO.types.model, 'Backbone model');
    equals(collection.type, BKVO.types.collection, 'Backbone collection');
});


test('detectElementInterface', function() {
    expect(7);

    equals(BKVO.detectElementInterface(text), 'value', 'text input');
    equals(BKVO.detectElementInterface(check), 'checked', 'checkbox');
    equals(BKVO.detectElementInterface(radio), 'checked', 'radio button');
    equals(BKVO.detectElementInterface(select), 'value', 'select box');
    equals(BKVO.detectElementInterface(button), 'html', 'button');
    equals(BKVO.detectElementInterface(email), 'value', 'email (variant of text input)');
    equals(BKVO.detectElementInterface(submit), 'value', 'submit button');
});


test('detectDomEvent', function() {
    expect(7);

    equals(BKVO.detectDomEvent(text), 'keyup', 'text input');
    equals(BKVO.detectDomEvent(check), 'change', 'checkbox');
    equals(BKVO.detectDomEvent(radio), 'change', 'radio button');
    equals(BKVO.detectDomEvent(select), 'change', 'select box');
    equals(BKVO.detectDomEvent(button), 'click', 'button');
    equals(BKVO.detectDomEvent(email), 'keyup', 'email (variant of text input)');
    equals(BKVO.detectDomEvent(submit), 'submit', 'submit button');
});


test('getEvents', function() {
    expect(9);

    deepEqual(BKVO.getEvents(text), ['keyup'], 'text input');
    deepEqual(BKVO.getEvents(check), ['change'], 'checkbox');
    deepEqual(BKVO.getEvents(radio), ['change'], 'radio button');
    deepEqual(BKVO.getEvents(select), ['change'], 'select box');
    deepEqual(BKVO.getEvents(button), ['click'], 'button');
    deepEqual(BKVO.getEvents(email), ['keyup'], 'email (variant of text input)');
    deepEqual(BKVO.getEvents(submit), ['submit'], 'submit button');

    raises(function() {
        BKVO.getEvents(span);
    }, 'span element has to default DOM event');

    deepEqual(BKVO.getEvents(model), ['change']);
});


test('getInterfaces - detected', function() {
    expect(9);

    deepEqual(BKVO.getInterfaces(text, model), {value: 'text'}, 'text input observing a model');
    deepEqual(BKVO.getInterfaces(check, text), {checked: 'value'}, 'checkbox observing a text input');
    deepEqual(BKVO.getInterfaces(radio, text), {checked: 'value'}, 'radio observing a text input');
    deepEqual(BKVO.getInterfaces(select, model), {value: 'select'}, 'select box observing a model');
    deepEqual(BKVO.getInterfaces(model, button), {button: 'html'}, 'model observing a button');
    deepEqual(BKVO.getInterfaces(email, model), {value: 'email'}, 'email observing a model');
    deepEqual(BKVO.getInterfaces(span, text), {text: 'value'}, 'span observing a text input');
    deepEqual(BKVO.getInterfaces(span, model), {text: ''}, 'span observing a model.. no interfaces');

    raises(function() {
        BKVO.getInterfaces(model, model);
    }, 'model observing a model.. no interfaces');

});


test('getInterfaces - subject interface', function() {
    expect(5);

    deepEqual(BKVO.getInterfaces(text, model, 'title'), {value: 'title'}, 'text input observing model.title');
    deepEqual(BKVO.getInterfaces(check, model, 'public'), {checked: 'public'}, 'checkbox observing model.public');
    deepEqual(BKVO.getInterfaces(text, model, ['first', 'last']), {value: ['first', 'last']}, 'text input observing model.first and model.last');
    deepEqual(BKVO.getInterfaces(span, model, 'title'), {text: 'title'}, 'span observing model.title');

    raises(function() {
        BKVO.getInterfaces(model, model, ['first', 'last']);
    }, 'model observing a model.. ambiguous observer interface');
});


module('Built-in Interfaces', {
    setup: function() {
        span.object.html('Hello World');
        text.object.val('hello world');
        check.object.prop('checked', true);
        radio.object.prop('disabled', true);
        select.object.hide().val('');
        button.object.html('Click Me!');
    }
});

test('get value', function() {
    expect(4);

    equals(BKVO.interfaces.get(text, 'value'),'hello world', 'alias');
    equals(BKVO.interfaces.get(text, 'prop:value'), 'hello world', 'prop');

    equals(BKVO.interfaces.get(select, 'value'), '', 'alias');
    equals(BKVO.interfaces.get(select, 'prop:value'), '', 'prop');
});

test('set value', function() {
    expect(10);

    // input
    BKVO.interfaces.set(text, 'value', 'foobar');
    equals(BKVO.interfaces.get(text, 'value'), 'foobar', 'text, string');

    BKVO.interfaces.set(text, 'value', 1);
    equals(BKVO.interfaces.get(text, 'value'), '1', 'text, number');

    BKVO.interfaces.set(text, 'value', []);
    equals(BKVO.interfaces.get(text, 'value'), '', 'text, array');

    BKVO.interfaces.set(text, 'value', true);
    equals(BKVO.interfaces.get(text, 'value'), 'true', 'text, bool');

    // select
    BKVO.interfaces.set(select, 'value', 'not an option');
    equals(BKVO.interfaces.get(select, 'value'), '', 'select, string');

    BKVO.interfaces.set(select, 'value', 1);
    equals(BKVO.interfaces.get(select, 'value'), '1', 'select, number');

    BKVO.interfaces.set(select, 'value', []);
    equals(BKVO.interfaces.get(select, 'value'), null, 'select, array (empty)');

    BKVO.interfaces.set(select, 'value', [1]);
    equals(BKVO.interfaces.get(select, 'value'), '1', 'select, array (choice)');

    BKVO.interfaces.set(select, 'value', ['foo']);
    equals(BKVO.interfaces.get(select, 'value'), '', 'select, array (bad choice)');

    BKVO.interfaces.set(select, 'value', true);
    equals(BKVO.interfaces.get(select, 'value'), '', 'select, bool');

});


test('get text', function() {
    expect(2);

    equals(BKVO.interfaces.get(span, 'text'), 'Hello World', 'span');
    equals(BKVO.interfaces.get(span, 'prop:innerText'), 'Hello World', 'span');

});


test('set text', function() {
    expect(3);

    BKVO.interfaces.set(span, 'text', 'Foo Bar');
    equals(BKVO.interfaces.get(span, 'text'), 'Foo Bar', 'span string');

    BKVO.interfaces.set(span, 'text', 1);
    equals(BKVO.interfaces.get(span, 'text'), '1', 'span number');

    BKVO.interfaces.set(span, 'text', []);
    equals(BKVO.interfaces.get(span, 'text'), '', 'span array');

});


test('get html', function() {
    expect(2);

    equals(BKVO.interfaces.get(span, 'html'), 'Hello World', 'alias');
    equals(BKVO.interfaces.get(span, 'prop:innerHTML'), 'Hello World', 'prop');

});


test('set html', function() {
    expect(4);

    BKVO.interfaces.set(span, 'html', '<em>Hello</em>');
    equals(BKVO.interfaces.get(span, 'html').toLowerCase(), '<em>hello</em>', 'span html');

    BKVO.interfaces.set(span, 'html', 'Hello');
    equals(BKVO.interfaces.get(span, 'html'), 'Hello', 'span string');

    BKVO.interfaces.set(span, 'html', 1);
    equals(BKVO.interfaces.get(span, 'html'), '1', 'span number');

    BKVO.interfaces.set(span, 'html', []);
    equals(BKVO.interfaces.get(span, 'html'), '', 'span array');

});


test('get checked', function() {
    expect(4);

    equals(BKVO.interfaces.get(check, 'checked'), true, 'checkbox alias');
    equals(BKVO.interfaces.get(check, 'prop:checked'), true, 'checkbox prop');

    equals(BKVO.interfaces.get(radio, 'checked'), false, 'radio alias');
    equals(BKVO.interfaces.get(radio, 'prop:checked'), false, 'radio prop');

});


test('set checked', function() {
    expect(4);

    BKVO.interfaces.set(check, 'checked', true);
    equals(BKVO.interfaces.get(check, 'checked'), true, 'checkbox bool');

    BKVO.interfaces.set(check, 'checked', 0);
    equals(BKVO.interfaces.get(check, 'checked'), false, 'checkbox zero');

    BKVO.interfaces.set(check, 'checked', []);
    equals(BKVO.interfaces.get(check, 'checked'), false, 'checkbox empty array');

    BKVO.interfaces.set(check, 'checked', null);
    equals(BKVO.interfaces.get(check, 'checked'), false, 'checkbox null');

});


test('get disabled', function() {
    expect(4);

    equals(BKVO.interfaces.get(check, 'disabled'), false, 'checkbox alias');
    equals(BKVO.interfaces.get(check, 'prop:disabled'), false, 'checkbox prop');

    equals(BKVO.interfaces.get(radio, 'disabled'), true, 'radio alias');
    equals(BKVO.interfaces.get(radio, 'prop:disabled'), true, 'radio prop');

});


test('set disabled', function() {
    expect(4);

    BKVO.interfaces.set(check, 'disabled', true);
    equals(BKVO.interfaces.get(check, 'disabled'), true, 'checkbox bool');

    BKVO.interfaces.set(check, 'disabled', 0);
    equals(BKVO.interfaces.get(check, 'disabled'), false, 'checkbox zero');

    BKVO.interfaces.set(check, 'disabled', []);
    equals(BKVO.interfaces.get(check, 'disabled'), false, 'checkbox empty array');

    BKVO.interfaces.set(check, 'disabled', null);
    equals(BKVO.interfaces.get(check, 'disabled'), false, 'checkbox null');

});


test('get enabled', function() {
    expect(4);

    equals(BKVO.interfaces.get(check, 'enabled'), true, 'checkbox alias');
    equals(!BKVO.interfaces.get(check, 'prop:disabled'), true, 'checkbox prop');

    equals(BKVO.interfaces.get(radio, 'enabled'), false, 'radio alias');
    equals(!BKVO.interfaces.get(radio, 'prop:disabled'), false, 'radio prop');

});


test('set enabled', function() {
    expect(4);

    BKVO.interfaces.set(check, 'enabled', true);
    equals(BKVO.interfaces.get(check, 'enabled'), true, 'checkbox bool');

    BKVO.interfaces.set(check, 'enabled', 0);
    equals(BKVO.interfaces.get(check, 'enabled'), false, 'checkbox zero');

    BKVO.interfaces.set(check, 'enabled', []);
    equals(BKVO.interfaces.get(check, 'enabled'), false, 'checkbox empty array');

    BKVO.interfaces.set(check, 'enabled', null);
    equals(BKVO.interfaces.get(check, 'enabled'), false, 'checkbox null');

});


test('get visible', function() {
    expect(2);
    equals(BKVO.interfaces.get(select, 'visible'), false, 'alias');
    equals(BKVO.interfaces.get(select, 'style:display'), 'none', 'style');
});


test('get hidden', function() {
    expect(2);
    equals(BKVO.interfaces.get(select, 'hidden'), true, 'alias');
    equals(BKVO.interfaces.get(select, 'style:display'), 'none', 'style');
});


test('css', function() {
    expect(3);

    BKVO.interfaces.set(submit, 'css:fancy', false);
    equals(BKVO.interfaces.get(submit, 'css:fancy'), false, 'css bool');

    BKVO.interfaces.set(submit, 'css:fancy', 'Hello');
    equals(BKVO.interfaces.get(submit, 'css:fancy'), true, 'css string');

    BKVO.interfaces.set(submit, 'css:fancy', []);
    equals(BKVO.interfaces.get(submit, 'css:fancy'), false, 'css empty array');
});



module('jQuery Observers', {
    setup: function() {
        span.object.html('Hello World');
        text.object.val('hello world');
        check.object.prop('checked', true);
        radio.object.prop('disabled', true);
        select.object.hide().val('');
        button.object.html('Click Me!');
    }
});

// jQuery observers have two means of being notified by the subject. 
test('read-only non-form element', function() {
    expect(5);

    // shorthand for specifying a particular interface for the observers
    span.observe(model, 'title');
    model.object.set({title: 'Cool Title'});
    equals(span.object.text(), 'Cool Title', 'the span element observes the title attr on the model');

    model.object.unbind();

    span.observe(model, {
        interface: ['title', 'author'],
        handler: function() {
            return model.object.get('title') + ' by ' + model.object.get('author');
        }
    });

    model.object.set({title: 'Yet Again!', author: 'John Doe'});
    equals(span.object.text(), 'Yet Again! by John Doe', 'the span element observes the title and author attr on the model'); 

    model.object.unbind();

    var model2 = new Backbone.Model({
        foo: 'Bar'
    });

    model.observe(model2, 'foo');
    equals(model.object.get('foo'), 'Bar', 'initial value');
    model2.set({foo: 'Hello'});
    equals(model.object.get('foo'), 'Hello', 'model is observing model2');

    text.observe(model);

    model.object.set({text: 'Foo'});
    equals(text.object.val(), 'Foo');

    model.object.unbind();
});
