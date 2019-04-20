
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var App = (function () {
	'use strict';

	function noop() {}

	function assign(tar, src) {
		for (var k in src) tar[k] = src[k];
		return tar;
	}

	function run(fn) {
		return fn();
	}

	function blankObject() {
		return Object.create(null);
	}

	function run_all(fns) {
		fns.forEach(run);
	}

	function is_function(thing) {
		return typeof thing === 'function';
	}

	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function create_slot(definition, ctx, fn) {
		if (definition) {
			const slot_ctx = get_slot_context(definition, ctx, fn);
			return definition[0](slot_ctx);
		}
	}

	function get_slot_context(definition, ctx, fn) {
		return definition[1]
			? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
			: ctx.$$scope.ctx;
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function destroyEach(iterations, detach) {
		for (var i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detach);
		}
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function addListener(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	function preventDefault(fn) {
		return function(event) {
			event.preventDefault();
			return fn.call(this, event);
		};
	}

	function setAttribute(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else node.setAttribute(attribute, value);
	}

	function children (element) {
		return Array.from(element.childNodes);
	}

	function setData(text, data) {
		text.data = '' + data;
	}

	function setStyle(node, key, value) {
		node.style.setProperty(key, value);
	}

	let outros;

	function group_outros() {
		outros = {
			remaining: 0,
			callbacks: []
		};
	}

	function check_outros() {
		if (!outros.remaining) {
			run_all(outros.callbacks);
		}
	}

	function on_outro(callback) {
		outros.callbacks.push(callback);
	}

	let current_component;

	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error(`Function called outside component initialization`);
		return current_component;
	}

	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}

	function onDestroy(fn) {
		get_current_component().$$.on_destroy.push(fn);
	}

	let dirty_components = [];

	let update_promise;
	const binding_callbacks = [];
	const render_callbacks = [];

	function schedule_update() {
		if (!update_promise) {
			update_promise = Promise.resolve();
			update_promise.then(flush);
		}
	}

	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	function flush() {
		const seen_callbacks = new Set();

		do {
			// first, call beforeUpdate functions
			// and update components
			while (dirty_components.length) {
				const component = dirty_components.shift();
				set_current_component(component);
				update(component.$$);
			}

			while (binding_callbacks.length) binding_callbacks.shift()();

			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			while (render_callbacks.length) {
				const callback = render_callbacks.pop();
				if (!seen_callbacks.has(callback)) {
					callback();

					// ...so guard against infinite loops
					seen_callbacks.add(callback);
				}
			}
		} while (dirty_components.length);

		update_promise = null;
	}

	function update($$) {
		if ($$.fragment) {
			$$.update($$.dirty);
			run_all($$.before_render);
			$$.fragment.p($$.dirty, $$.ctx);
			$$.dirty = null;

			$$.after_render.forEach(add_render_callback);
		}
	}

	function mount_component(component, target, anchor) {
		const { fragment, on_mount, on_destroy, after_render } = component.$$;

		fragment.m(target, anchor);

		// onMount happens after the initial afterUpdate. Because
		// afterUpdate callbacks happen in reverse order (inner first)
		// we schedule onMount callbacks before afterUpdate callbacks
		add_render_callback(() => {
			const new_on_destroy = on_mount.map(run).filter(is_function);
			if (on_destroy) {
				on_destroy.push(...new_on_destroy);
			} else {
				// Edge case — component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});

		after_render.forEach(add_render_callback);
	}

	function destroy(component, detach) {
		if (component.$$) {
			run_all(component.$$.on_destroy);
			component.$$.fragment.d(detach);

			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			component.$$.on_destroy = component.$$.fragment = null;
			component.$$.ctx = {};
		}
	}

	function make_dirty(component, key) {
		if (!component.$$.dirty) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty = {};
		}
		component.$$.dirty[key] = true;
	}

	function init(component, options, instance, create_fragment, not_equal$$1) {
		const parent_component = current_component;
		set_current_component(component);

		const props = options.props || {};

		const $$ = component.$$ = {
			fragment: null,
			ctx: null,

			// state
			update: noop,
			not_equal: not_equal$$1,
			bound: blankObject(),

			// lifecycle
			on_mount: [],
			on_destroy: [],
			before_render: [],
			after_render: [],
			context: new Map(parent_component ? parent_component.$$.context : []),

			// everything else
			callbacks: blankObject(),
			dirty: null
		};

		let ready = false;

		$$.ctx = instance
			? instance(component, props, (key, value) => {
				if ($$.bound[key]) $$.bound[key](value);

				if ($$.ctx) {
					const changed = not_equal$$1(value, $$.ctx[key]);
					if (ready && changed) {
						make_dirty(component, key);
					}

					$$.ctx[key] = value;
					return changed;
				}
			})
			: props;

		$$.update();
		ready = true;
		run_all($$.before_render);
		$$.fragment = create_fragment($$.ctx);

		if (options.target) {
			if (options.hydrate) {
				$$.fragment.l(children(options.target));
			} else {
				$$.fragment.c();
			}

			if (options.intro && component.$$.fragment.i) component.$$.fragment.i();
			mount_component(component, options.target, options.anchor);
			flush();
		}

		set_current_component(parent_component);
	}

	class SvelteComponent {
		$destroy() {
			destroy(this, true);
			this.$destroy = noop;
		}

		$on(type, callback) {
			const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
			callbacks.push(callback);

			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		$set() {
			// overridden by instance, if it has props
		}
	}

	var fetch$1 = async (path, query) => {
	  const params = Object.entries(query).reduce((queryString, param, index) => {
	    const prefix = index === 0 ? '?' : '&';
	    return `${queryString}${prefix}${param[0]}=${param[1]}`
	  }, '');
	  const request = await fetch(`http://localhost:3001${path}${params}`);
	  if (!request.ok) {
	    return { failed: request.status }
	  } else {
	    return await request.json()
	  }
	};

	function writable(value) {
		const subscribers = [];

		function set(newValue) {
			if (newValue === value) return;
			value = newValue;
			subscribers.forEach(s => s[1]());
			subscribers.forEach(s => s[0](value));
		}

		function update(fn) {
			set(fn(value));
		}

		function subscribe(run, invalidate = noop) {
			const subscriber = [run, invalidate];
			subscribers.push(subscriber);
			run(value);

			return () => {
				const index = subscribers.indexOf(subscriber);
				if (index !== -1) subscribers.splice(index, 1);
			};
		}

		return { set, update, subscribe };
	}

	console.log(localStorage.getItem('user'));

	const pageStore = writable('/');
	const userStore = writable({
	  Username: localStorage.getItem('Username'),
	  Role: localStorage.getItem('Role'),
	  FirstName: localStorage.getItem('FirstName'),
	  LastName: localStorage.getItem('LastName'),
	});

	const updateUser = user => {
	  userStore.set(user);
	  Object.entries(user).forEach(([userAttrKey, userAttrValue]) => {
	    localStorage.setItem(userAttrKey, userAttrValue);
	  });
	};

	const changePage = path => {
	  history.pushState({}, '', path);
	  pageStore.set(path);
	};

	/* src/login.html generated by Svelte v3.0.0-beta.3 */

	// (4:2) {#if invalidLogin}
	function create_if_block(ctx) {
		var p;

		return {
			c() {
				p = createElement("p");
				p.textContent = "Sorry, but your email or password were incorrect :(";
				p.className = "error svelte-1nu7tl0";
			},

			m(target, anchor) {
				insert(target, p, anchor);
			},

			d(detach) {
				if (detach) {
					detachNode(p);
				}
			}
		};
	}

	function create_fragment(ctx) {
		var h1, text1, form, text2, table, text8, button0, text10, button1, dispose;

		var if_block = (ctx.invalidLogin) && create_if_block(ctx);

		return {
			c() {
				h1 = createElement("h1");
				h1.textContent = "Atlanta Beltline Project";
				text1 = createText("\n\n");
				form = createElement("form");
				if (if_block) if_block.c();
				text2 = createText("\n  ");
				table = createElement("table");
				table.innerHTML = `<tr><td>Email:</td>
			      <td><input type="text" name="email" id="email"></td></tr>
			    <tr><td>Password:</td>
			      <td><input type="password" name="password" id="password"></td></tr>`;
				text8 = createText("\n\n  ");
				button0 = createElement("button");
				button0.textContent = "Login";
				text10 = createText("\n  ");
				button1 = createElement("button");
				button1.textContent = "Register";
				button0.className = "general-button";
				button0.id = "login";
				button0.type = "submit";
				button1.className = "general-button";
				button1.id = "register";
				setAttribute(button1, "onclick", "register()");
				form.name = "myForm";
				form.id = "loginForm";
				dispose = addListener(form, "submit", preventDefault(ctx.login));
			},

			m(target, anchor) {
				insert(target, h1, anchor);
				insert(target, text1, anchor);
				insert(target, form, anchor);
				if (if_block) if_block.m(form, null);
				append(form, text2);
				append(form, table);
				append(form, text8);
				append(form, button0);
				append(form, text10);
				append(form, button1);
			},

			p(changed, ctx) {
				if (ctx.invalidLogin) {
					if (!if_block) {
						if_block = create_if_block(ctx);
						if_block.c();
						if_block.m(form, text2);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},

			i: noop,
			o: noop,

			d(detach) {
				if (detach) {
					detachNode(h1);
					detachNode(text1);
					detachNode(form);
				}

				if (if_block) if_block.d();
				dispose();
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		
	  let invalidLogin = false;

	  const login = async () => {
	    const email = document.getElementById('email').value;
	    const password = document.getElementById('password').value;
	    const user = await fetch$1('/login', {
	      email: email,
	      password: password,
	    });
	    if (user.failed) {
	      invalidLogin = true; $$invalidate('invalidLogin', invalidLogin);
	    } else {
	      updateUser(user);
	      changePage('/');
	    }
	  };

		return { invalidLogin, login };
	}

	class Login extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance, create_fragment, safe_not_equal);
		}
	}

	/* src/link.html generated by Svelte v3.0.0-beta.3 */

	function create_fragment$1(ctx) {
		var a, dispose;

		const default_slot_1 = ctx.$$slot_default;
		const default_slot = create_slot(default_slot_1, ctx, null);

		return {
			c() {
				a = createElement("a");

				if (default_slot) default_slot.c();

				a.href = ctx.href;
				dispose = addListener(a, "click", preventDefault(ctx.goToPage));
			},

			l(nodes) {
				if (default_slot) default_slot.l(a_nodes);
			},

			m(target, anchor) {
				insert(target, a, anchor);

				if (default_slot) {
					default_slot.m(a, null);
				}
			},

			p(changed, ctx) {

				if (default_slot && changed.$$scope) {
					default_slot.p(assign(assign({},(changed)), ctx.$$scope.changed), get_slot_context(default_slot_1, ctx, null));
				}

				if (changed.href) {
					a.href = ctx.href;
				}
			},

			i: noop,
			o: noop,

			d(detach) {
				if (detach) {
					detachNode(a);
				}

				if (default_slot) default_slot.d(detach);
				dispose();
			}
		};
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { href = '/' } = $$props;

	  const goToPage = () => {
	    console.log('something');
	    pageStore.set(href);
	    history.pushState({}, '', href);
	  };

		let { $$slot_default, $$scope } = $$props;

		$$self.$set = $$props => {
			if ('href' in $$props) $$invalidate('href', href = $$props.href);
			if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
		};

		return { href, goToPage, $$slot_default, $$scope };
	}

	class Link extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$1, create_fragment$1, safe_not_equal);
		}

		get href() {
			return this.$$.ctx.href;
		}

		set href(href) {
			this.$set({ href });
			flush();
		}
	}

	/* src/dashboard.html generated by Svelte v3.0.0-beta.3 */

	// (3:0) <Link href="admin-user-mngr">
	function create_default_slot(ctx) {
		var text;

		return {
			c() {
				text = createText("Manager Users");
			},

			m(target, anchor) {
				insert(target, text, anchor);
			},

			d(detach) {
				if (detach) {
					detachNode(text);
				}
			}
		};
	}

	function create_fragment$2(ctx) {
		var h1, text1, p, text2, text3, current;

		var link = new Link({
			props: {
			href: "admin-user-mngr",
			$$slot_default: [create_default_slot],
			$$scope: { ctx }
		}
		});

		return {
			c() {
				h1 = createElement("h1");
				h1.textContent = "Home!";
				text1 = createText("\n");
				p = createElement("p");
				text2 = createText(ctx.userRole);
				text3 = createText("\n");
				link.$$.fragment.c();
			},

			m(target, anchor) {
				insert(target, h1, anchor);
				insert(target, text1, anchor);
				insert(target, p, anchor);
				append(p, text2);
				insert(target, text3, anchor);
				mount_component(link, target, anchor);
				current = true;
			},

			p(changed, ctx) {
				if (!current || changed.userRole) {
					setData(text2, ctx.userRole);
				}
			},

			i(local) {
				if (current) return;
				link.$$.fragment.i(local);

				current = true;
			},

			o(local) {
				link.$$.fragment.o(local);
				current = false;
			},

			d(detach) {
				if (detach) {
					detachNode(h1);
					detachNode(text1);
					detachNode(p);
					detachNode(text3);
				}

				link.$destroy(detach);
			}
		};
	}

	function instance$2($$self, $$props, $$invalidate) {
		

	  let userRole = 'user';

	  onMount(() => {
	    const user = $userStore;

	    if (!user || !user.Username) {
	      changePage('/login');
	    }

	    userRole = user.Role; $$invalidate('userRole', userRole);
	  });

		let $userStore;
		$$self.$$.on_destroy.push(userStore.subscribe($$value => { $userStore = $$value; $$invalidate('$userStore', $userStore); }));

		return { userRole };
	}

	class Dashboard extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$2, create_fragment$2, safe_not_equal);
		}
	}

	/* src/admin/user-mngr.html generated by Svelte v3.0.0-beta.3 */

	function create_fragment$3(ctx) {
		var h1, text1, form, table0, tr, td0, text3, td1, text4, td2, text6, td3, select0, option0, option1, option2, option3, option4, text12, td4, text14, td5, select1, option5, option6, option7, option8, text19, button0, text21, button1, text23, button2, text25, br0, text26, br1, text27, table1, text55, button3;

		return {
			c() {
				h1 = createElement("h1");
				h1.textContent = "Manage User";
				text1 = createText("\n\n");
				form = createElement("form");
				table0 = createElement("table");
				tr = createElement("tr");
				td0 = createElement("td");
				td0.textContent = "Username";
				text3 = createText("\n      ");
				td1 = createElement("td");
				td1.innerHTML = `<input type="text" name="usernameText">`;
				text4 = createText("\n      ");
				td2 = createElement("td");
				td2.textContent = "Type";
				text6 = createText("\n      ");
				td3 = createElement("td");
				select0 = createElement("select");
				option0 = createElement("option");
				option0.textContent = "ALL";
				option1 = createElement("option");
				option1.textContent = "User";
				option2 = createElement("option");
				option2.textContent = "Visitor";
				option3 = createElement("option");
				option3.textContent = "Staff";
				option4 = createElement("option");
				option4.textContent = "Manager";
				text12 = createText("\n      ");
				td4 = createElement("td");
				td4.textContent = "Status";
				text14 = createText("\n      ");
				td5 = createElement("td");
				select1 = createElement("select");
				option5 = createElement("option");
				option5.textContent = "ALL";
				option6 = createElement("option");
				option6.textContent = "Approved";
				option7 = createElement("option");
				option7.textContent = "Pending";
				option8 = createElement("option");
				option8.textContent = "Declined";
				text19 = createText("\n\n  ");
				button0 = createElement("button");
				button0.textContent = "Filter";
				text21 = createText("\n  ");
				button1 = createElement("button");
				button1.textContent = "Approve";
				text23 = createText("\n  ");
				button2 = createElement("button");
				button2.textContent = "Decline";
				text25 = createText("\n  ");
				br0 = createElement("br");
				text26 = createText("\n  ");
				br1 = createElement("br");
				text27 = createText("\n\n  ");
				table1 = createElement("table");
				table1.innerHTML = `<tr class="border-table"><th class="border-table">
			        Username
			        <div class="sort-buttons"><div class="triangle-up" onclick="usernameUp()"></div>
			          <div class="triangle-down" onclick="usernameDown()"></div></div></th>
			      <th class="border-table">
			        Email Count
			        <div class="sort-buttons"><div class="triangle-up" onclick="emailUp()"></div>
			          <div class="triangle-down" onclick="emailDown()"></div></div></th>
			      <th class="border-table">
			        User Type
			        <div class="sort-buttons"><div class="triangle-up" onclick="typeUp()"></div>
			          <div class="triangle-down" onclick="typeDown()"></div></div></th>
			      <th class="border-table">
			        Status
			        <div class="sort-buttons"><div class="triangle-up" onclick="statusUp()"></div>
			          <div class="triangle-down" onclick="statussDown()"></div></div></th></tr>
			    <tr class="border-table"><td class="border-table"><input type="radio" name="route" value="cwilson"> cwilson
			      </td>
			      <td class="border-table">3</td>
			      <td class="border-table">Manager</td>
			      <td class="border-table">Pending</td></tr>
			    <tr class="border-table"><td class="border-table"><input type="radio" name="route" value="jasonlee"> jasonlee
			      </td>
			      <td class="border-table">1</td>
			      <td class="border-table">Manager</td>
			      <td class="border-table">Declined</td></tr>`;
				text55 = createText("\n\n  ");
				button3 = createElement("button");
				button3.textContent = "Back";
				option0.__value = "ALL";
				option0.value = option0.__value;
				option1.__value = "User";
				option1.value = option1.__value;
				option2.__value = "Visitor";
				option2.value = option2.__value;
				option3.__value = "Staff";
				option3.value = option3.__value;
				option4.__value = "Manager";
				option4.value = option4.__value;
				select0.name = "type";
				option5.__value = "ALL";
				option5.value = option5.__value;
				option6.__value = "Approved";
				option6.value = option6.__value;
				option7.__value = "Pending";
				option7.value = option7.__value;
				option8.__value = "Declined";
				option8.value = option8.__value;
				select1.name = "type";
				button0.className = "general-button";
				setAttribute(button0, "onclick", "filter()");
				setStyle(button0, "margin-left", "100px");
				button1.className = "general-button";
				setAttribute(button1, "onclick", "approve()");
				setStyle(button1, "margin-left", "150px");
				button2.className = "general-button";
				setAttribute(button2, "onclick", "decline()");
				table1.id = "email-table";
				table1.className = "border-table";
				button3.className = "general-button";
				setAttribute(button3, "onclick", "back()");
				form.name = "myForm";
			},

			m(target, anchor) {
				insert(target, h1, anchor);
				insert(target, text1, anchor);
				insert(target, form, anchor);
				append(form, table0);
				append(table0, tr);
				append(tr, td0);
				append(tr, text3);
				append(tr, td1);
				append(tr, text4);
				append(tr, td2);
				append(tr, text6);
				append(tr, td3);
				append(td3, select0);
				append(select0, option0);
				append(select0, option1);
				append(select0, option2);
				append(select0, option3);
				append(select0, option4);
				append(tr, text12);
				append(tr, td4);
				append(tr, text14);
				append(tr, td5);
				append(td5, select1);
				append(select1, option5);
				append(select1, option6);
				append(select1, option7);
				append(select1, option8);
				append(form, text19);
				append(form, button0);
				append(form, text21);
				append(form, button1);
				append(form, text23);
				append(form, button2);
				append(form, text25);
				append(form, br0);
				append(form, text26);
				append(form, br1);
				append(form, text27);
				append(form, table1);
				append(form, text55);
				append(form, button3);
			},

			p: noop,
			i: noop,
			o: noop,

			d(detach) {
				if (detach) {
					detachNode(h1);
					detachNode(text1);
					detachNode(form);
				}
			}
		};
	}

	class User_mngr extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, null, create_fragment$3, safe_not_equal);
		}
	}

	const stateAbbreviations = [
	  'AL',
	  'AK',
	  'AS',
	  'AZ',
	  'AR',
	  'CA',
	  'CO',
	  'CT',
	  'DE',
	  'DC',
	  'FM',
	  'FL',
	  'GA',
	  'GU',
	  'HI',
	  'ID',
	  'IL',
	  'IN',
	  'IA',
	  'KS',
	  'KY',
	  'LA',
	  'ME',
	  'MH',
	  'MD',
	  'MA',
	  'MI',
	  'MN',
	  'MS',
	  'MO',
	  'MT',
	  'NE',
	  'NV',
	  'NH',
	  'NJ',
	  'NM',
	  'NY',
	  'NC',
	  'ND',
	  'MP',
	  'OH',
	  'OK',
	  'OR',
	  'PW',
	  'PA',
	  'PR',
	  'RI',
	  'SC',
	  'SD',
	  'TN',
	  'TX',
	  'UT',
	  'VT',
	  'VI',
	  'VA',
	  'WA',
	  'WV',
	  'WI',
	  'WY',
	];

	/* src/register.html generated by Svelte v3.0.0-beta.3 */

	function get_each_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.state = list[i];
		return child_ctx;
	}

	// (40:10) {#each stateAbbreviations as state}
	function create_each_block(ctx) {
		var option, text_value = ctx.state, text, option_value_value;

		return {
			c() {
				option = createElement("option");
				text = createText(text_value);
				option.__value = option_value_value = ctx.state;
				option.value = option.__value;
			},

			m(target, anchor) {
				insert(target, option, anchor);
				append(option, text);
			},

			p(changed, ctx) {
				option.value = option.__value;
			},

			d(detach) {
				if (detach) {
					detachNode(option);
				}
			}
		};
	}

	function create_fragment$4(ctx) {
		var h1, text1, form, table0, tr0, text7, tr1, td4, text9, td5, text10, td6, text12, td7, select0, option0, option1, text15, tr2, text21, tr3, text27, tr4, td16, text29, td17, text30, td18, text32, td19, select1, text33, td20, text35, td21, text36, table1, text41, button1, text43, button2;

		var each_value = stateAbbreviations;

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
		}

		return {
			c() {
				h1 = createElement("h1");
				h1.textContent = "Register Employee";
				text1 = createText("\n\n");
				form = createElement("form");
				table0 = createElement("table");
				tr0 = createElement("tr");
				tr0.innerHTML = `<td>First Name</td>
			      <td><input type="text" name="fname"></td>
			      <td>Last Name</td>
			      <td><input type="text" name="lname"></td>`;
				text7 = createText("\n    ");
				tr1 = createElement("tr");
				td4 = createElement("td");
				td4.textContent = "Username";
				text9 = createText("\n      ");
				td5 = createElement("td");
				td5.innerHTML = `<input type="text" name="username">`;
				text10 = createText("\n      ");
				td6 = createElement("td");
				td6.textContent = "User Type";
				text12 = createText("\n      ");
				td7 = createElement("td");
				select0 = createElement("select");
				option0 = createElement("option");
				option0.textContent = "Manager";
				option1 = createElement("option");
				option1.textContent = "Staff";
				text15 = createText("\n    ");
				tr2 = createElement("tr");
				tr2.innerHTML = `<td>Password</td>
			      <td><input type="password" name="password1"></td>
			      <td>Confirm Password</td>
			      <td><input type="password" name="password2"></td>`;
				text21 = createText("\n    ");
				tr3 = createElement("tr");
				tr3.innerHTML = `<td>Phone</td>
			      <td><input type="text" name="phone"></td>
			      <td>Address</td>
			      <td><input type="text" name="address"></td>`;
				text27 = createText("\n    ");
				tr4 = createElement("tr");
				td16 = createElement("td");
				td16.textContent = "City";
				text29 = createText("\n      ");
				td17 = createElement("td");
				td17.innerHTML = `<input type="text" name="city">`;
				text30 = createText("\n      ");
				td18 = createElement("td");
				td18.textContent = "State";
				text32 = createText("\n      ");
				td19 = createElement("td");
				select1 = createElement("select");

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				text33 = createText("\n      ");
				td20 = createElement("td");
				td20.textContent = "Zipcode";
				text35 = createText("\n      ");
				td21 = createElement("td");
				td21.innerHTML = `<input type="text" name="zipcode">`;
				text36 = createText("\n\n  ");
				table1 = createElement("table");
				table1.innerHTML = `<tr><td>Email</td>
			      <td><input type="text" id="email"></td>
			      <td><button class="table-button" type="button" onclick="addEmail()">
			          Add
			        </button></td></tr>`;
				text41 = createText("\n\n");
				button1 = createElement("button");
				button1.textContent = "Back";
				text43 = createText("\n");
				button2 = createElement("button");
				button2.textContent = "Register";
				option0.__value = "Manager";
				option0.value = option0.__value;
				option1.__value = "Staff";
				option1.value = option1.__value;
				select0.name = "type";
				select1.name = "state";
				table1.id = "email-table";
				form.name = "myForm";
				button1.className = "general-button";
				setAttribute(button1, "onclick", "back()");
				button2.className = "general-button";
				setAttribute(button2, "onclick", "register()");
			},

			m(target, anchor) {
				insert(target, h1, anchor);
				insert(target, text1, anchor);
				insert(target, form, anchor);
				append(form, table0);
				append(table0, tr0);
				append(table0, text7);
				append(table0, tr1);
				append(tr1, td4);
				append(tr1, text9);
				append(tr1, td5);
				append(tr1, text10);
				append(tr1, td6);
				append(tr1, text12);
				append(tr1, td7);
				append(td7, select0);
				append(select0, option0);
				append(select0, option1);
				append(table0, text15);
				append(table0, tr2);
				append(table0, text21);
				append(table0, tr3);
				append(table0, text27);
				append(table0, tr4);
				append(tr4, td16);
				append(tr4, text29);
				append(tr4, td17);
				append(tr4, text30);
				append(tr4, td18);
				append(tr4, text32);
				append(tr4, td19);
				append(td19, select1);

				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(select1, null);
				}

				append(tr4, text33);
				append(tr4, td20);
				append(tr4, text35);
				append(tr4, td21);
				append(form, text36);
				append(form, table1);
				insert(target, text41, anchor);
				insert(target, button1, anchor);
				insert(target, text43, anchor);
				insert(target, button2, anchor);
			},

			p(changed, ctx) {
				if (changed.stateAbbreviations) {
					each_value = stateAbbreviations;

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
						} else {
							each_blocks[i] = create_each_block(child_ctx);
							each_blocks[i].c();
							each_blocks[i].m(select1, null);
						}
					}

					for (; i < each_blocks.length; i += 1) {
						each_blocks[i].d(1);
					}
					each_blocks.length = each_value.length;
				}
			},

			i: noop,
			o: noop,

			d(detach) {
				if (detach) {
					detachNode(h1);
					detachNode(text1);
					detachNode(form);
				}

				destroyEach(each_blocks, detach);

				if (detach) {
					detachNode(text41);
					detachNode(button1);
					detachNode(text43);
					detachNode(button2);
				}
			}
		};
	}

	function instance$3($$self) {

		return {};
	}

	class Register extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$3, create_fragment$4, safe_not_equal);
		}
	}

	/* src/index.html generated by Svelte v3.0.0-beta.3 */

	function create_fragment$5(ctx) {
		var main, div, current;

		var switch_value = ctx.currPageComponent;

		function switch_props(ctx) {
			return {};
		}

		if (switch_value) {
			var switch_instance = new switch_value(switch_props(ctx));
		}

		return {
			c() {
				main = createElement("main");
				div = createElement("div");
				if (switch_instance) switch_instance.$$.fragment.c();
				div.className = "content-container svelte-jqjcyd";
				main.className = "svelte-jqjcyd";
			},

			m(target, anchor) {
				insert(target, main, anchor);
				append(main, div);

				if (switch_instance) {
					mount_component(switch_instance, div, null);
				}

				current = true;
			},

			p(changed, ctx) {
				if (switch_value !== (switch_value = ctx.currPageComponent)) {
					if (switch_instance) {
						group_outros();
						const old_component = switch_instance;
						on_outro(() => {
							old_component.$destroy();
						});
						old_component.$$.fragment.o(1);
						check_outros();
					}

					if (switch_value) {
						switch_instance = new switch_value(switch_props(ctx));

						switch_instance.$$.fragment.c();
						switch_instance.$$.fragment.i(1);
						mount_component(switch_instance, div, null);
					} else {
						switch_instance = null;
					}
				}
			},

			i(local) {
				if (current) return;
				if (switch_instance) switch_instance.$$.fragment.i(local);

				current = true;
			},

			o(local) {
				if (switch_instance) switch_instance.$$.fragment.o(local);
				current = false;
			},

			d(detach) {
				if (detach) {
					detachNode(main);
				}

				if (switch_instance) switch_instance.$destroy();
			}
		};
	}

	function instance$4($$self, $$props, $$invalidate) {
		

	  let currPageComponent = Dashboard;

	  const pages = [
	    {
	      path: '/',
	      component: Dashboard,
	    },
	    {
	      path: '/login',
	      component: Login,
	    },
	    {
	      path: '/admin-user-mngr',
	      component: User_mngr,
	    },
	    {
	      path: '/register',
	      component: Register,
	    },
	  ];

	  onMount(() => pageStore.set(location.pathname));

	  const unsubscribe = pageStore.subscribe(path => {
	    const matchingPage = pages.find(page => page.path === path);
	    if (matchingPage) {
	      currPageComponent = matchingPage.component; $$invalidate('currPageComponent', currPageComponent);
	    }
	  });

	  onDestroy(() => unsubscribe());

		return { currPageComponent };
	}

	class Index extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$4, create_fragment$5, safe_not_equal);
		}
	}

	const app = new Index({
	  target: document.body,
	});

	return app;

}());
