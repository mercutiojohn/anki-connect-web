> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [remix.run](https://remix.run/docs/en/main/file-conventions/routes)

> While you can configure routes via the "routes" plugin option, most routes are created with this file......

While you can configure routes via [the "routes" plugin option](https://remix.run/docs/en/main/file-conventions/vite-config#routes), most routes are created with this file system convention. Add a file, get a route.

Please note that you can use either `.js`, `.jsx`, `.ts` or `.tsx` file extensions. We'll stick with `.tsx` in the examples to avoid duplication.

Dilum Sanjaya made [an awesome visualization](https://interactive-remix-routing-v2.netlify.app/) of how routes in the file system map to the URL in your app that might help you understand these conventions.

[](#disclaimer)Disclaimer
-------------------------

Before we go too far into the Remix convention though, we'd like to point out that file-based routing is an **incredibly** subjective idea. Some folks love the "flat" routes idea, some folks hate it and would prefer nesting routes in folders. Some folks simply hate file-based routing and would prefer to configure routes via JSON. Some folks would prefer to configure routes via JSX like they did in their React Router SPA's.

The point is, we are well aware of this and from the get-go, Remix has always given you a first-class way to opt-out via the [`routes`](https://remix.run/docs/en/main/file-conventions/vite-config#routes)/[`ignoredRouteFiles`](https://remix.run/docs/en/main/file-conventions/vite-config#ignoredroutefiles) and [configure your routes manually](https://remix.run/docs/en/main/discussion/routes#manual-route-configuration). But, there has to be _some_ default so that folks can get up and running quickly and easily - and we think that the flat routes convention document below is a pretty good default that scales well for small-to-medium sized apps.

Large applications with hundreds or thousands of routes will _always_ be a bit chaotic no matter what convention you use - and the idea is that via the `routes` config, you get to build _exactly_ the convention that works best for your application/team. It would be quite literally impossible for Remix to have a default convention that made everyone happy. We'd much rather give you a fairly straightforward default, and then let the community build any number of conventions you can pick and choose from.

So, before we dive into the details of the Remix default convention, here's some community alternatives you can check out if you decide that our default is not your cup of tea.

*   [`remix-flat-routes`](https://github.com/kiliman/remix-flat-routes) - The Remix default is basically a simplified version of this package. The author has continued to iterate on and evolve this package so if you generally like the "flat routes" idea but want a bit more power (including a hybrid approach of files and folders), definitely check this one out.
*   [`remix-custom-routes`](https://github.com/jacobparis-insiders/remix-custom-routes) - If you want even more customization, this package lets you define that types of files should be treated as routes. This lets you go beyond the simple flat/nested concept and do something such as _"any file with an extension of `.route.tsx` is a route"_.
*   [`remix-json-routes`](https://github.com/brophdawg11/remix-json-routes) - If you just want to specify your routes via a config file, this is your jam - just provide Remix a JSON object with your routes and skip the flat/nested concept entirely. There's even a JSX option in there too.

[](#root-route)Root Route
-------------------------

```
app/
├── routes/
└── root.tsx


```

The file in `app/root.tsx` is your root layout, or "root route" (very sorry for those of you who pronounce those words the same way!). It works just like all other routes, so you can export a [`loader`](https://remix.run/docs/en/main/route/loader), [`action`](https://remix.run/docs/en/main/route/action), etc.

The root route typically looks something like this. It serves as the root layout of the entire app, all other routes will render inside the [`<Outlet />`](https://remix.run/docs/en/main/components/outlet).

```
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export default function Root() {
  return (
    <html lang="en">
      <head>
        <Links />
        <Meta />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}


```

[](#basic-routes)Basic Routes
-----------------------------

Any JavaScript or TypeScript files in the `app/routes` directory will become routes in your application. The filename maps to the route's URL pathname, except for `_index.tsx` which is the [index route](https://remix.run/docs/en/main/discussion/routes#index-routes) for the [root route](#root-route).

```
app/
├── routes/
│   ├── _index.tsx
│   └── about.tsx
└── root.tsx


```

<table><thead><tr><th>URL</th><th>Matched Routes</th></tr></thead><tbody><tr><td><code>/</code></td><td><code>app/routes/_index.tsx</code></td></tr><tr><td><code>/about</code></td><td><code>app/routes/about.tsx</code></td></tr></tbody></table>

Note that these routes will be rendered in the outlet of `app/root.tsx` because of [nested routing](https://remix.run/docs/en/main/discussion/routes#what-is-nested-routing).

[](#dot-delimiters)Dot Delimiters
---------------------------------

Adding a `.` to a route filename will create a `/` in the URL.

```
 app/
├── routes/
│   ├── _index.tsx
│   ├── about.tsx
│   ├── concerts.trending.tsx
│   ├── concerts.salt-lake-city.tsx
│   └── concerts.san-diego.tsx
└── root.tsx


```

<table><thead><tr><th>URL</th><th>Matched Route</th></tr></thead><tbody><tr><td><code>/</code></td><td><code>app/routes/_index.tsx</code></td></tr><tr><td><code>/about</code></td><td><code>app/routes/about.tsx</code></td></tr><tr><td><code>/concerts/trending</code></td><td><code>app/routes/concerts.trending.tsx</code></td></tr><tr><td><code>/concerts/salt-lake-city</code></td><td><code>app/routes/concerts.salt-lake-city.tsx</code></td></tr><tr><td><code>/concerts/san-diego</code></td><td><code>app/routes/concerts.san-diego.tsx</code></td></tr></tbody></table>

The dot delimiter also creates nesting, see the [nesting section](#nested-routes) for more information.

[](#dynamic-segments)Dynamic Segments
-------------------------------------

Usually your URLs aren't static but data-driven. Dynamic segments allow you to match segments of the URL and use that value in your code. You create them with the `$` prefix.

```
 app/
├── routes/
│   ├── _index.tsx
│   ├── about.tsx
│   ├── concerts.$city.tsx
│   └── concerts.trending.tsx
└── root.tsx


```

<table><thead><tr><th>URL</th><th>Matched Route</th></tr></thead><tbody><tr><td><code>/</code></td><td><code>app/routes/_index.tsx</code></td></tr><tr><td><code>/about</code></td><td><code>app/routes/about.tsx</code></td></tr><tr><td><code>/concerts/trending</code></td><td><code>app/routes/concerts.trending.tsx</code></td></tr><tr><td><code>/concerts/salt-lake-city</code></td><td><code>app/routes/concerts.$city.tsx</code></td></tr><tr><td><code>/concerts/san-diego</code></td><td><code>app/routes/concerts.$city.tsx</code></td></tr></tbody></table>

Remix will parse the value from the URL and pass it to various APIs. We call these values "URL Parameters". The most useful places to access the URL params are in [loaders](https://remix.run/docs/en/main/route/loader) and [actions](https://remix.run/docs/en/main/route/action).

```
export async function loader({
  params,
}: LoaderFunctionArgs) {
  return fakeDb.getAllConcertsForCity(params.city);
}


```

You'll note the property name on the `params` object maps directly to the name of your file: `$city.tsx` becomes `params.city`.

Routes can have multiple dynamic segments, like `concerts.$city.$date`, both are accessed on the params object by name:

```
export async function loader({
  params,
}: LoaderFunctionArgs) {
  return fake.db.getConcerts({
    date: params.date,
    city: params.city,
  });
}


```

See the [routing guide](https://remix.run/docs/en/main/discussion/routes) for more information.

[](#nested-routes)Nested Routes
-------------------------------

Nested Routing is the general idea of coupling segments of the URL to component hierarchy and data. You can read more about it in the [Routing Guide](https://remix.run/docs/en/main/discussion/routes#what-is-nested-routing).

You create nested routes with [dot delimiters](#dot-delimiters). If the filename before the `.` matches another route filename, it automatically becomes a child route to the matching parent. Consider these routes:

```
 app/
├── routes/
│   ├── _index.tsx
│   ├── about.tsx
│   ├── concerts._index.tsx
│   ├── concerts.$city.tsx
│   ├── concerts.trending.tsx
│   └── concerts.tsx
└── root.tsx


```

All the routes that start with `app/routes/concerts.` will be child routes of `app/routes/concerts.tsx` and render inside the parent route's [outlet_component](https://remix.run/docs/en/main/components/outlet).

<table><thead><tr><th>URL</th><th>Matched Route</th><th>Layout</th></tr></thead><tbody><tr><td><code>/</code></td><td><code>app/routes/_index.tsx</code></td><td><code>app/root.tsx</code></td></tr><tr><td><code>/about</code></td><td><code>app/routes/about.tsx</code></td><td><code>app/root.tsx</code></td></tr><tr><td><code>/concerts</code></td><td><code>app/routes/concerts._index.tsx</code></td><td><code>app/routes/concerts.tsx</code></td></tr><tr><td><code>/concerts/trending</code></td><td><code>app/routes/concerts.trending.tsx</code></td><td><code>app/routes/concerts.tsx</code></td></tr><tr><td><code>/concerts/salt-lake-city</code></td><td><code>app/routes/concerts.$city.tsx</code></td><td><code>app/routes/concerts.tsx</code></td></tr></tbody></table>

Note you typically want to add an index route when you add nested routes so that something renders inside the parent's outlet when users visit the parent URL directly.

For example, if the URL is `/concerts/salt-lake-city` then the UI hierarchy will look like this:

```
<Root>
  <Concerts>
    <City />
  </Concerts>
</Root>


```

[](#nested-urls-without-layout-nesting)Nested URLs without Layout Nesting
-------------------------------------------------------------------------

Sometimes you want the URL to be nested, but you don't want the automatic layout nesting. You can opt out of nesting with a trailing underscore on the parent segment:

```
 app/
├── routes/
│   ├── _index.tsx
│   ├── about.tsx
│   ├── concerts.$city.tsx
│   ├── concerts.trending.tsx
│   ├── concerts.tsx
│   └── concerts_.mine.tsx
└── root.tsx


```

<table><thead><tr><th>URL</th><th>Matched Route</th><th>Layout</th></tr></thead><tbody><tr><td><code>/</code></td><td><code>app/routes/_index.tsx</code></td><td><code>app/root.tsx</code></td></tr><tr><td><code>/about</code></td><td><code>app/routes/about.tsx</code></td><td><code>app/root.tsx</code></td></tr><tr><td><code>/concerts/mine</code></td><td><code>app/routes/concerts_.mine.tsx</code></td><td><code>app/root.tsx</code></td></tr><tr><td><code>/concerts/trending</code></td><td><code>app/routes/concerts.trending.tsx</code></td><td><code>app/routes/concerts.tsx</code></td></tr><tr><td><code>/concerts/salt-lake-city</code></td><td><code>app/routes/concerts.$city.tsx</code></td><td><code>app/routes/concerts.tsx</code></td></tr></tbody></table>

Note that `/concerts/mine` does not nest with `app/routes/concerts.tsx` anymore, but `app/root.tsx`. The `trailing_` underscore creates a path segment, but it does not create layout nesting.

Think of the `trailing_` underscore as the long bit at the end of your parent's signature, writing you out of the will, removing the segment that follows from the layout nesting.

[](#nested-layouts-without-nested-urls)Nested Layouts without Nested URLs
-------------------------------------------------------------------------

We call these **Pathless Routes**

Sometimes you want to share a layout with a group of routes without adding any path segments to the URL. A common example is a set of authentication routes that have a different header/footer than the public pages or the logged in app experience. You can do this with a `_leading` underscore.

```
 app/
├── routes/
│   ├── _auth.login.tsx
│   ├── _auth.register.tsx
│   ├── _auth.tsx
│   ├── _index.tsx
│   ├── concerts.$city.tsx
│   └── concerts.tsx
└── root.tsx


```

<table><thead><tr><th>URL</th><th>Matched Route</th><th>Layout</th></tr></thead><tbody><tr><td><code>/</code></td><td><code>app/routes/_index.tsx</code></td><td><code>app/root.tsx</code></td></tr><tr><td><code>/login</code></td><td><code>app/routes/_auth.login.tsx</code></td><td><code>app/routes/_auth.tsx</code></td></tr><tr><td><code>/register</code></td><td><code>app/routes/_auth.register.tsx</code></td><td><code>app/routes/_auth.tsx</code></td></tr><tr><td><code>/concerts</code></td><td><code>app/routes/concerts.tsx</code></td><td><code>app/root.tsx</code></td></tr><tr><td><code>/concerts/salt-lake-city</code></td><td><code>app/routes/concerts.$city.tsx</code></td><td><code>app/routes/concerts.tsx</code></td></tr></tbody></table>

Think of the `_leading` underscore as a blanket you're pulling over the filename, hiding the filename from the URL.

[](#optional-segments)Optional Segments
---------------------------------------

Wrapping a route segment in parentheses will make the segment optional.

```
 app/
├── routes/
│   ├── ($lang)._index.tsx
│   ├── ($lang).$productId.tsx
│   └── ($lang).categories.tsx
└── root.tsx


```

<table><thead><tr><th>URL</th><th>Matched Route</th></tr></thead><tbody><tr><td><code>/</code></td><td><code>app/routes/($lang)._index.tsx</code></td></tr><tr><td><code>/categories</code></td><td><code>app/routes/($lang).categories.tsx</code></td></tr><tr><td><code>/en/categories</code></td><td><code>app/routes/($lang).categories.tsx</code></td></tr><tr><td><code>/fr/categories</code></td><td><code>app/routes/($lang).categories.tsx</code></td></tr><tr><td><code>/american-flag-speedo</code></td><td><code>app/routes/($lang)._index.tsx</code></td></tr><tr><td><code>/en/american-flag-speedo</code></td><td><code>app/routes/($lang).$productId.tsx</code></td></tr><tr><td><code>/fr/american-flag-speedo</code></td><td><code>app/routes/($lang).$productId.tsx</code></td></tr></tbody></table>

You may wonder why `/american-flag-speedo` is matching the `($lang)._index.tsx` route instead of `($lang).$productId.tsx`. This is because when you have an optional dynamic param segment followed by another dynamic param, Remix cannot reliably determine if a single-segment URL such as `/american-flag-speedo` should match `/:lang` `/:productId`. Optional segments match eagerly and thus it will match `/:lang`. If you have this type of setup it's recommended to look at `params.lang` in the `($lang)._index.tsx` loader and redirect to `/:lang/american-flag-speedo` for the current/default language if `params.lang` is not a valid language code.

[](#splat-routes)Splat Routes
-----------------------------

While [dynamic segments](#dynamic-segments) match a single path segment (the stuff between two `/` in a URL), a splat route will match the rest of a URL, including the slashes.

```
 app/
├── routes/
│   ├── _index.tsx
│   ├── $.tsx
│   ├── about.tsx
│   └── files.$.tsx
└── root.tsx


```

<table><thead><tr><th>URL</th><th>Matched Route</th></tr></thead><tbody><tr><td><code>/</code></td><td><code>app/routes/_index.tsx</code></td></tr><tr><td><code>/about</code></td><td><code>app/routes/about.tsx</code></td></tr><tr><td><code>/beef/and/cheese</code></td><td><code>app/routes/$.tsx</code></td></tr><tr><td><code>/files</code></td><td><code>app/routes/files.$.tsx</code></td></tr><tr><td><code>/files/talks/remix-conf_old.pdf</code></td><td><code>app/routes/files.$.tsx</code></td></tr><tr><td><code>/files/talks/remix-conf_final.pdf</code></td><td><code>app/routes/files.$.tsx</code></td></tr><tr><td><code>/files/talks/remix-conf-FINAL-MAY_2022.pdf</code></td><td><code>app/routes/files.$.tsx</code></td></tr></tbody></table>

Similar to dynamic route parameters, you can access the value of the matched path on the splat route's `params` with the `"*"` key.

```
export async function loader({
  params,
}: LoaderFunctionArgs) {
  const filePath = params["*"];
  return fake.getFileInfo(filePath);
}


```

[](#escaping-special-characters)Escaping Special Characters
-----------------------------------------------------------

If you want one of the special characters Remix uses for these route conventions to actually be a part of the URL, you can escape the conventions with `[]` characters.

<table><thead><tr><th>Filename</th><th>URL</th></tr></thead><tbody><tr><td><code>app/routes/sitemap[.]xml.tsx</code></td><td><code>/sitemap.xml</code></td></tr><tr><td><code>app/routes/[sitemap.xml].tsx</code></td><td><code>/sitemap.xml</code></td></tr><tr><td><code>app/routes/weird-url.[_index].tsx</code></td><td><code>/weird-url/_index</code></td></tr><tr><td><code>app/routes/dolla-bills-[$].tsx</code></td><td><code>/dolla-bills-$</code></td></tr><tr><td><code>app/routes/[[so-weird]].tsx</code></td><td><code>/[so-weird]</code></td></tr></tbody></table>

[](#folders-for-organization)Folders for Organization
-----------------------------------------------------

Routes can also be folders with a `route.tsx` file inside defining the route module. The rest of the files in the folder will not become routes. This allows you to organize your code closer to the routes that use them instead of repeating the feature names across other folders.

The files inside a folder have no meaning for the route paths, the route path is completely defined by the folder name

Consider these routes:

```
 app/
├── routes/
│   ├── _landing._index.tsx
│   ├── _landing.about.tsx
│   ├── _landing.tsx
│   ├── app._index.tsx
│   ├── app.projects.tsx
│   ├── app.tsx
│   └── app_.projects.$id.roadmap.tsx
└── root.tsx


```

Some, or all of them can be folders holding their own `route` module inside.

```
app/
├── routes/
│   ├── _landing._index/
│   │   ├── route.tsx
│   │   └── scroll-experience.tsx
│   ├── _landing.about/
│   │   ├── employee-profile-card.tsx
│   │   ├── get-employee-data.server.ts
│   │   ├── route.tsx
│   │   └── team-photo.jpg
│   ├── _landing/
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   └── route.tsx
│   ├── app._index/
│   │   ├── route.tsx
│   │   └── stats.tsx
│   ├── app.projects/
│   │   ├── get-projects.server.ts
│   │   ├── project-buttons.tsx
│   │   ├── project-card.tsx
│   │   └── route.tsx
│   ├── app/
│   │   ├── footer.tsx
│   │   ├── primary-nav.tsx
│   │   └── route.tsx
│   ├── app_.projects.$id.roadmap/
│   │   ├── chart.tsx
│   │   ├── route.tsx
│   │   └── update-timeline.server.ts
│   └── contact-us.tsx
└── root.tsx


```

Note that when you turn a route module into a folder, the route module becomes `folder/route.tsx`, all other modules in the folder will not become routes. For example:

```
# these are the same route:
app/routes/app.tsx
app/routes/app/route.tsx

# as are these
app/routes/app._index.tsx
app/routes/app._index/route.tsx


```

[](#scaling)Scaling
-------------------

Our general recommendation for scale is to make every route a folder and put the modules used exclusively by that route in the folder, then put the shared modules outside of routes folder elsewhere. This has a couple benefits:

*   Easy to identify shared modules, so tread lightly when changing them
*   Easy to organize and refactor the modules for a specific route without creating "file organization fatigue" and cluttering up other parts of the app