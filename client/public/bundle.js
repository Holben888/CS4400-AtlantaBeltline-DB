
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var App = (function () {
	'use strict';

	function noop() {}

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

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function createComment() {
		return document.createComment('');
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

	/* src/dashboard.html generated by Svelte v3.0.0-beta.3 */

	function create_fragment$1(ctx) {
		var h1, text1, p, text2;

		return {
			c() {
				h1 = createElement("h1");
				h1.textContent = "Home!";
				text1 = createText("\n");
				p = createElement("p");
				text2 = createText(ctx.userRole);
			},

			m(target, anchor) {
				insert(target, h1, anchor);
				insert(target, text1, anchor);
				insert(target, p, anchor);
				append(p, text2);
			},

			p(changed, ctx) {
				if (changed.userRole) {
					setData(text2, ctx.userRole);
				}
			},

			i: noop,
			o: noop,

			d(detach) {
				if (detach) {
					detachNode(h1);
					detachNode(text1);
					detachNode(p);
				}
			}
		};
	}

	function instance$1($$self, $$props, $$invalidate) {
		

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
			init(this, options, instance$1, create_fragment$1, safe_not_equal);
		}
	}

	/* src/index.html generated by Svelte v3.0.0-beta.3 */

	function create_fragment$2(ctx) {
		var switch_instance_anchor, current;

		var switch_value = ctx.currPageComponent;

		function switch_props(ctx) {
			return {};
		}

		if (switch_value) {
			var switch_instance = new switch_value(switch_props(ctx));
		}

		return {
			c() {
				if (switch_instance) switch_instance.$$.fragment.c();
				switch_instance_anchor = createComment();
			},

			m(target, anchor) {
				if (switch_instance) {
					mount_component(switch_instance, target, anchor);
				}

				insert(target, switch_instance_anchor, anchor);
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
						mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
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
					detachNode(switch_instance_anchor);
				}

				if (switch_instance) switch_instance.$destroy(detach);
			}
		};
	}

	function instance$2($$self, $$props, $$invalidate) {
		

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
			init(this, options, instance$2, create_fragment$2, safe_not_equal);
		}
	}

	const app = new Index({
	  target: document.body,
	});

	return app;

}());
