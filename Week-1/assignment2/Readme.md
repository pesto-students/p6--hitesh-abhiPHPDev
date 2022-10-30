## Pestotech Week 1 assignment

# What happens when you type a URL into your browser?

Every day you open up your browser and navigate to your favorite websites — whether it be social media, news, or e-commerce sites. You go to this page by typing in a url or clicking on a link to the page. Have you ever thought about what happens behind the scenes? How does the news get to you when you press enter after typing in the URL? How did the images on this post show up in your browser? How does your Twitter feed and the tweet data show up in your browser securely?
First, we’ll take a look at the relationship between websites, servers, and IP addresses. Then, we’ll go through the steps your browser takes to:

1. look up the location of the server hosting the website
2. make the connection to the server
3. send a request to get the specific page
4. handle the response from the server and
   how it renders the page so you, the viewer, can interact with the website

### Websites, servers, IP addresses

Websites are collections of files, often HTML, CSS, Javascript, and images, that tell your browser how to display the site, images, and data. They need to be accessible to anyone from anywhere at anytime, so hosting them on your computer at home isn’t be scalable or reliable. A powerful external computer connected to the Internet, called a server, stores these files.

When you point your browser at a URL like https://durgeshtanwar.com/hello-world, your browser has to figure out which server on the Internet is hosting the site. It does this by looking up the domain, durgeshtanwar.com, to find the address.

Each device on the Internet — servers, cell phones, your smart refrigerator — all have a unique address called an IP address. An IP address contains four numbered parts:

203.0.113.0

But numbers like this are hard to remember! That’s where domain names come in. durgeshtanwar.com is much easier to remember than 203.0.113.0, right? Imagine having to remember all the phone numbers of your contacts without having the Contacts app on your phone. Your Contacts app lets you look up phone numbers by name.

We do the same on the Internet. The domain name system, or DNS, is like the Contacts app on our phone. DNS helps our browser (and us) find servers on the Internet. We can do a DNS lookup to find the IP address of the server based on the domain name, durgeshtanwar.com. You can read more about DNS here.

Now that you know about the different parts and how they relate to one another, let’s look at each step of the process and how the browser communicates with the server when you type in a URL. Whether you typed in a URL or clicked on a linked URL from the current page, the process is the same.

## The Process

To show how all these steps fit together, I’m going to use an Amazon Lightsail instance and a Lightsail DNS zone. I’m using Lightsail because it’s one of the simplest services to manage virtual private servers (VPS) and DNS in one place, but these concepts work for any VPS and DNS service.

1. You type https://jennapederson.dev/hello-world in your browser and press Enter
   Let’s break down the parts of this URL you typed in to get here.

https://jennapederson.dev/hello-world

### Scheme

https:// is the scheme. HTTPS stands for Hypertext Transfer Protocol Secure. This scheme tells the browser to make a connection to the server using Transport Layer Security, or TLS. TLS is an encryption protocol to secure communications over the Internet. With HTTPS, the data exchanged between your browser and the server, like passwords or credit card info, is encrypted. You may have also seen ftp://, mailto://, or file://. These are other protocols that browsers know how to handle.

### Domain

jennapederson.dev is the domain name of the site. It is the memorable address and points to a specific server’s IP address. If you look at the Lightsail DNS zone below, you can see a DNS A record pointing to the Lightsail instance, jennapedersondev-static-ip, which represents the static IP address of the Lightsail instance.

![This is a sample image](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2021/08/11/amazon-lightsail-console-cdn-distribution.png)

### Path

Sometimes there is an additional path to the resource in the URL. For example, for this URL,https://jennapederson.dev/the-path-to/hello-world, the-path-to is the path on the server to the requested resource, hello-world. You can think of this like the directory structure of files and other directories on your computer. It’s a way to organize your resources, whether they are static HTML, CSS, Javascript, or image files, or dynamically generated content. Common examples of paths are blog, posts, tags, or images, each grouping different resources.

### Resource

When you typed this URL into your browser, hello-world is the name of the resource on the website you want to view. Sometimes you’ll see this with a file extension like .html which indicates this is a static file on the server with HTML content. Without an extension, like this URL, it usually indicates the server generated this content. For instance, a news site would show you customized, up to date, and local news content, which it can only do when it knows who you are or where the request came from.

## 2. Browser looks up IP address for the domain

After you’ve typed the URL into your browser and pressed enter, the browser needs to figure out which server on the Internet to connect to. To do that, it needs to look up the IP address of the server hosting the website using the domain you typed in. It does this using a DNS lookup.
Because DNS is complex and has to be blazingly fast, DNS data is cached at different layers between your browser and at various places across the Internet. Your browser checks its own cache, the operating system cache, a local network cache at your router, and a DNS server cache on your corporate network or at your internet service provider (ISP). If the browser cannot find the IP address at any of those cache layers, the DNS server on your corporate network or at your ISP does a recursive DNS lookup. A recursive DNS lookup asks multiple DNS servers around the Internet, which in turn ask more DNS servers for the DNS record until it is found.

Once the browser gets the DNS record with the IP address, it’s time for it to find the server on the Internet and establish a connection.

## 3. Browser initiates TCP connection with the server

Using the public Internet routing infrastructure, packets from a client browser request get routed through the router, the ISP, through an internet exchange to switch ISPs or networks, all using transmission control protocol, more commonly known as TCP, to find the server with the IP address to connect to. But this is a very roundabout way to get there and it’s not efficient.

Instead, many sites use a content delivery network, or CDN, to cache static and dynamic content closer to the browser. In our example, I’ve set the Lightsail instance, jennapedersondev, as an origin for a CDN distribution.

![TCP IP connection with the server](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2021/08/11/amazon-lightsail-console-cdn-distribution.png)

A CDN is a globally distributed network of caching servers that improve the performance of your site or app (the origin) by bringing the content closer to your users. The Lightsail CDN uses CloudFront, which is part of the AWS global network. Requests from the client browser get to take advantage of this private network that has ultra-low latency and high availability. To track the hops the request takes from my computer to jennapederson.dev, we can use traceroute. In the image below, the first hop (the first row) is to my router. Hops in box one are on my ISP’s network and hops in box two are on the AWS global network.

![CDN image](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2021/08/11/trace-route-tracking-hops.png)

Instead of relying on the public internet routing infrastructure and being subject to extra hops, redeliveries, and packet loss, the client browser request gets to take a ride on the AWS global network. The request is intelligently routed through the most performant location to deliver content to your browser.

Once the browser finds the server on the Internet, it establishes a TCP connection with the server and if HTTPS is being used, a TLS handshake takes place to secure the communication. TCP and and TLS are extremely important topics, but we’ll cover them in another post.

In image the below, this connection (Initial connection) took 130.30ms.

![Image showing the speed of connection](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2021/08/11/initial-connection-duration.png)

Once the browser has established a connection with the server, the next step is to send the HTTP request to get the resource, or the page.

## 4. Browser sends the HTTP request to the server

Now that the browser has a connection to the server, it follows the rules of communication for the HTTP(s) protocol. It starts with the browser sending an HTTP request to the server to request the contents of the page. The HTTP request contains a request line, headers (or metadata about the request), and a body. The request line contains information that the server can use to determine what the client (in this case, your browser) wants to do.

The request line contains the following:

a request method, which is one of GET, POST, PUT, PATCH, DELETE, or a handful of other HTTP verbs
the path, pointing to the requested resources
the HTTP version to communicate with
The request line for the URL request looks like this:

```
GET /hello-world HTTP/1.1

```

Remember that HTTP verbs express the semantic intent of your request. You could also use the POST, PUT, or PATCH methods to send data to the server for storage, either to create new data or update existing data at the request path. The DELETE method would delete the resource at the given path. However, it’s important to know that servers don’t have to support all verbs. A server could respond with a 200 OK status to a DELETE method and not do anything with the resource.
The next part of the request is the request headers. Headers pass extra information along from the client that help route the request, indicate what type of client is making the request (the user agent), and can be used for supporting A/B testing, blue/green deployments, and canary deployments.
Headers are key-value pairs like this:

```
Host: jennapederson.dev
User-Agent: curl/7.64.1
Accept: */*
```

The last part of the request is the body. The body is (usually) empty for a GET request like ours. For a request that manipulates resources, like POST, PUT, or PATCH, the body will contain the data from the client to create or update.
The request body can be in different formats and the server understands the format based on a request header, Content-Type.
Here’s an example of the full request for the URL, with the request line and headers (no body since this is a GET):

```
GET /hello-world/ HTTP/1.1
Host: jennapederson.dev
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"
sec-ch-ua-mobile: ?0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: <https://jennapederson.dev/>
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
dnt: 1
sec-gpc: 1
```

Once the server has received the request from the client, the server processes it and sends back a response.

## 5. Server processes request and sends back a response

The server takes the request and based on the info in the request line, headers, and body, decides how to process the request. For the request, GET /hello-world/ HTTP/1.1, the server gets the content at this path, constructs the response and sends it back to the client. The response contains the following:

a status line, telling the client the status of the request
response headers, telling the browser how to handle the response
the requested resource at that path, either content like HTML, CSS, Javascript, or image files, or data
The status line contains both the HTTP version and a numeric and text representation of the status of the request. The response looks like this:

```
HTTP/1.1 200 OK
Date: Tue, 25 May 2021 19:40:59 GMT
Server: Apache
X-Frame-Options: SAMEORIGIN
X-Powered-By: Express
Cache-Control: max-age=0, no-cache
Content-Type: text/html; charset=utf-8
Vary: Accept-Encoding
X-Mod-Pagespeed: 1.13.35.2-0
Content-Encoding: br
Keep-Alive: timeout=1, max=100
Connection: Keep-Alive
Transfer-Encoding: chunked

<!DOCTYPE html>
<html lang="en">
<head>
    THE REST OF THE HTML

```

The browser considers a status code in the 200s to be successful. The response was 200, so the browser knows to render the response.
Resources can be static files, either text (i.e index.html) or non-text data (i.e. logo.img). Browsers aren’t always requesting static files, though. Often, these are dynamic resources generated at the time of the request and there is no file associated with the resource. In fact, in this request, that’s exactly what is happening. There is no file hello-world, but the server still knows how to process the request. The server generates a dynamic resource, building the HTML from fragments or templates and combining it with dynamic data to send back in the response, as text, so the browser can render the page.
Now that you know how the server builds the response to send back to the browser, let’s take a look at how the browser handles the response.

## 6. Browser renders the content

Once the browser has received the response from the server, it inspects the response headers for information on how to render the resource. The Content-Type header above tells the browser it received an HTML resource in the response body. Lucky for us, the browser knows what to do with HTML!
The first GET request returns HTML, the structure of the page. But if you inspect the HTML of the page (or any web page) with your browser’s dev tools, you’ll see it references other Javascript, CSS, image resources and requests additional data in order to render the web page as designed.
As the browser is parsing and rendering the HTML, it is making additional requests to get Javascript, CSS, images, and data. It can do much of this in parallel, but not always and that’s a story for a different post.

![final image of lodad webpage](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2021/08/11/tml-references-css-resource.png)

# what is the main functionality of the Browser?

The main function of a browser is to present the web resource you choose, by requesting it from the server and displaying it in the browser window. The resource is usually an HTML document, but may also be a PDF, image, or some other type of content. The location of the resource is specified by the user using a URI (Uniform Resource Identifier).

The way the browser interprets and displays HTML files is specified in the HTML and CSS specifications. These specifications are maintained by the W3C (World Wide Web Consortium) organization, which is the standards organization for the web. For years browsers conformed to only a part of the specifications and developed their own extensions. That caused serious compatibility issues for web authors. Today most of the browsers more or less conform to the specifications.

Browser user interfaces have a lot in common with each other. Among the common user interface elements are:

Address bar for inserting a URI
Back and forward buttons
Bookmarking options
Refresh and stop buttons for refreshing or stopping the loading of current documents
Home button that takes you to your home page
Strangely enough, the browser's user interface is not specified in any formal specification, it just comes from good practices shaped over years of experience and by browsers imitating each other. The HTML5 specification doesn't define UI elements a browser must have, but lists some common elements. Among those are the address bar, status bar and tool bar. There are, of course, features unique to a specific browser like Firefox's downloads manager.

![This is an image](/assets/browser.png)

# High Level Architecture of Browser

![High Level Architecture of Browser](https://miro.medium.com/max/998/1*RL0pnuf_hmLJ76oY6DViZw.png)

**1 The User Interface:** The user interface is the space where User interacts with the browser. It includes the address bar, back and next buttons, home button, refresh and stop, bookmark option, etc. Every other part, except the window where requested web page is displayed, comes under it.
**2 The Browser Engine:** The browser engine works as a bridge between the User interface and the rendering engine. According to the inputs from various user interfaces, it queries and manipulates the rendering engine.
**3 The Rendering Engine:** The rendering engine, as the name suggests is responsible for rendering the requested web page on the browser screen. The rendering engine interprets the HTML, XML documents and images that are formatted using CSS and generates the layout that is displayed in the User Interface. However, using plugins or extensions, it can display other types data also. Different browsers user different rendering engines:

- Internet Explorer: Trident
- Firefox & other Mozilla browsers: Gecko
- Chrome & Opera 15+: Blink
- Chrome (iPhone) & Safari: Webkit

  **4 Networking:** Component of the browser which retrieves the URLs using the common internet protocols of HTTP or FTP. The networking component handles all aspects of Internet communication and security. The network component may implement a cache of retrieved documents in order to reduce network traffic.
  **5 JavaScript Interpreter:** It is the component of the browser which interprets and executes the javascript code embedded in a website. The interpreted results are sent to the rendering engine for display. If the script is external then first the resource is fetched from the network. Parser keeps on hold until the script is executed.
  **6 UI Backend:** UI backend is used for drawing basic widgets like combo boxes and windows. This backend exposes a generic interface that is not platform specific. It underneath uses operating system user interface methods.
  **7 Data Persistence/Storage:** This is a persistence layer. Browsers support storage mechanisms such as localStorage, IndexedDB, WebSQL and FileSystem. It is a small database created on the local drive of the computer where the browser is installed. It manages user data such as cache, cookies, bookmarks and preferences.

# The rendering engine

Different browsers use different rendering engines: Internet Explorer uses Trident, Firefox uses Gecko, Safari uses WebKit. Chrome and Opera (from version 15) use Blink, a fork of WebKit.

WebKit is an open source rendering engine which started as an engine for the Linux platform and was modified by Apple to support Mac and Windows. See webkit.org for more details.

## The main flow

The rendering engine will start getting the contents of the requested document from the networking layer. This will usually be done in 8kB chunks.

After that, this is the basic flow of the rendering engine:

![render main flow](assets/render.png)

# HTML Parsing

So we have HTML content at the beginning which goes through a process called tokenization, tokenization is a common process in almost every programming language where code is split into several tokens which are easier to understand while parsing. This is where the HTML's parser understands which is the start and which is the end of the tag, which tag it is and what is inside the tag.

Now we know, html tag starts at the top and then the head tag starts before the html ends so we can figure out that the head is inside html and create a tree out of it. Thus we then get something called a parse tree which eventually becomes a DOM tree as shown in the image below:

![HTML Parsing](https://res.cloudinary.com/practicaldev/image/fetch/s--40NGH5el--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/o91r8lupx8elero5djh3.png)

DOM tree is what we access when we do document.getElementById or document.querySelector in JavaScript.

Just like HTML, CSS goes through a similar process where we have the CSS text and then the tokenization of CSS to eventually create something called a CSSOM or CSS Object Model.

This is what a CSS Object Model looks like:

# Tree Construction

The DOM and CSSOM trees are combined to form the render tree.
Render tree contains only the nodes required to render the page.
Layout computes the exact position and size of each object.
The last step is paint, which takes in the final render tree and renders the pixels to the screen.
First, the browser combines the DOM and CSSOM into a "render tree," which captures all the visible DOM content on the page and all the CSSOM style information for each node.

![Tree Construction](https://web-dev.imgix.net/image/C47gYyWYVMMhDmtYSLOWazuyePF2/b6Z2Gu6UD1x1imOu1tJV.png?auto=format&w=845)

To construct the render tree, the browser roughly does the following:

Starting at the root of the DOM tree, traverse each visible node.

Some nodes are not visible (for example, script tags, meta tags, and so on), and are omitted since they are not reflected in the rendered output.
Some nodes are hidden via CSS and are also omitted from the render tree; for example, the span node---in the example above---is missing from the render tree because we have an explicit rule that sets the "display: none" property on it.
For each visible node, find the appropriate matching CSSOM rules and apply them.

Emit visible nodes with content and their computed styles.

The final output is a render that contains both the content and style information of all the visible content on the screen. With the render tree in place, we can proceed to the "layout" stage.

# Layout

Up to this point we've calculated which nodes should be visible and their computed styles, but we have not calculated their exact position and size within the viewport of the device---that's the "layout" stage, also known as "reflow."

To figure out the exact size and position of each object on the page, the browser begins at the root of the render tree and traverses it. Let's consider a simple, hands-on example:

```
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Critial Path: Hello world!</title>
  </head>
  <body>
    <div style="width: 50%">
      <div style="width: 50%">Hello world!</div>
    </div>
  </body>
</html>
```

The body of the above page contains two nested div's: the first (parent) div sets the display size of the node to 50% of the viewport width, and the second div---contained by the parent---sets its width to be 50% of its parent; that is, 25% of the viewport width.

![](https://web-dev.imgix.net/image/C47gYyWYVMMhDmtYSLOWazuyePF2/IIr281DuPwRi9fiXhNg4.png?auto=format&w=650)

The output of the layout process is a "box model," which precisely captures the exact position and size of each element within the viewport: all of the relative measurements are converted to absolute pixels on the screen.

Finally, now that we know which nodes are visible, and their computed styles and geometry, we can pass this information to the final stage, which converts each node in the render tree to actual pixels on the screen. This step is often referred to as "painting" or "rasterizing."

# Painting

This can take some time because the browser has to do quite a bit of work. However, Chrome DevTools can provide some insight into all three of the stages described above. Let's examine the layout stage for our original "hello world" example:

![](https://web-dev.imgix.net/image/C47gYyWYVMMhDmtYSLOWazuyePF2/OHEypUdtsMQ9raPnW116.png?auto=format&w=845)

- The "Layout" event captures the render tree construction, position, and size calculation in the Timeline.
- When layout is complete, the browser issues "Paint Setup" and "Paint" events, which convert the render tree to pixels on the screen.

The time required to perform render tree construction, layout and paint varies based on the size of the document, the applied styles, and the device it is running on: the larger the document, the more work the browser has; the more complicated the styles, the more time taken for painting also (for example, a solid color is "cheap" to paint, while a drop shadow is "expensive" to compute and render).

The page is finally visible in the viewport:

![](https://web-dev.imgix.net/image/C47gYyWYVMMhDmtYSLOWazuyePF2/H9mc9hE33imsdh7TfCgm.png?auto=format&w=741)
