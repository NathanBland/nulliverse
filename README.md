# nulliverse
Named ironically. Serverless-blog-as-a-service system built on `aws-lambda`, `serverless`, `mlab`, and `node-js`.

This `README` is also a *basic* guide to getting started with `lambda` and `serverless`.

# Getting Started
First there are some things you will need to run this locally, and some things you will need to run this in `aws`.

## Pre-reqs
- node.js (^8.10)
- npm (^5.0.0)
- aws-cli (see note below)

If you plan to spin up your own instance, you will need the `aws cli` tools. Those can be found here: [https://docs.aws.amazon.com/cli/latest/userguide/installing.html](https://docs.aws.amazon.com/cli/latest/userguide/installing.html)

You will also need to configure your own `aws` `iamroles` and users. This is out of the scope of this guide, but there is excellent documentation for all things aws on the `docs.aws.amazon.com` site.

### npm packages
You will need some `npm` packages to work with `serverless`. The absolute minimum for this guide is:

- `serverless`
- `serverless-offline`

These need to be installed globaly:
`npm i -g serverless serverless-offline`

Depending on your platform, and how you have `npm` installed you may need to `sudo` that command.

You can skip the next two sections if you are cloning this repo. Just remember to run `npm i` after doing so to get dependencies.
## Installing `aws` template
Serverless, as a framework, allows you to work with serveral different cloud providers ranging from `Google Cloud Platform`, to `Microsoft Azure`, to `AWS` and others. We'll be using `aws` in this guide.

If you haven't cloned this repo and are making your own, be sure to do that. The `serverless` cli would spin up a blank one for you if you haven't, but I like having this established before hand.

*skip if you have cloned this repo.* Create your `serverless` instance in your repo directory:

`$ sls create --template aws-nodejs`

*Two notes: 1) `sls` is an alias of `serverless`, and saves typing. 2) not specifying a path, places it in your current directory.*

Now that we have our template loaded, let's also give it a `package.json` to track dependencies. *You can use yarn instead*

`$ npm init`. The defaults should be fine. You can change whatever you need to though to fit your needs. For example, I changed the license to `MIT`.

Now that we have that setup, let's take a look at a file that the serverless cli generated for us.


## Initial Configuration 
Opening `serverless.yaml` reveals a pretty large file. The first thing we want to look for is the `service` name, this lives somewhere around line `14`. You will want to change it to the name of whatever service/application you are creating. In this case, I'll name mine, `nulliverse-api`.

Secondly, we want to change the runtime in the `provider` section. You don't have to do this, but doing so enables newer node.js features without having to compile with something like babel.

I'm changing mine to be node 8, like this: 

```yaml
provider:
  name: aws
  runtime: nodejs8.10
```

I'm also going to uncomment, and move up the default stage, and region to be under provider. Since I want these flags enabled.

```yaml
provider:
  name: aws
  runtime: nodejs8.10
  stage: dev
  region: us-east-1
```

Now at this point you could deploy to `aws` and get a response. However, I find testing locally is _much_ faster. Which is why I installed `serverless-offline` globally. However, our local instance doesn't know about it, so we need to do two things.

First, we need to add it to our `package.json` file.

`$ npm i --save-dev serverless-offline` 

Next, we need to tell our `serverless` configuration that we are using it.

In `serverless.yml`
```yaml
service: nulliverse-api # NOTE: update this with your service name
plugins:
  - serverless-offline
```

Pretty straight forward.

We also want to be able to access some environmental variables in our application. To do this, let's add some additional config.
```yaml
provider:
  name: aws
  runtime: nodejs8.10
  region: us-east-1
  stage: dev
  environment:
    DB_URI: ${env:DB_URI}
    tokenSecret: ${env:tokenSecret}
```

These two variables will come in handy later, but they need to be established here for us to use them like we would in normal node runtimes.

## Handling Routes
Our default `handler.js` looks a lot different from what you are used to if you come from an `express.js` background, but it also very, very, simple. 

We can actually run our service/application now to see what it does.

`$ sls offline`

Will start our application locally, you'd actually fail to reach this route right now if you tried though.

`$ curl http://127.0.0.1:3000`

```text
statusCode":404,"error":"Serverless-offline: route not found.","currentRoute":"get - /","existingRoutes":[]
```

Let's make that reachable. Look for a `functions` section in your `yml` file, let's change it a bit.

```yaml
functions:
  hello:
    handler: handler.hello
    events:
      - http: get /
```

We are telling serverless that we want an `http` event to trigger a lambda function, the name of that function will be `hello`, and that the file that will handle it is named `handler`. The _function_ in that file that will handle it is exposed as `hello`

If we restart the `sls offline` server and try again we get a much larger payload this time with a 200 status. Perfect.

## Creating Routes
Now let's make our own routes. For now, hault the `sls-offline` server

First, let's setup a bit more configuration so we can easily organize our features.

In your `yml` file: *this should be right above your functions*
```yaml
package:
 include:
   - features/** #include all files in a folder named features.
```

Be sure to make that directory. 

`$ mkdir features models`

I also made a models directory at the same time, because we'll use that later.

### Our First Route
Under the features folder, make a new file, let's call it `post.js`

In `post.js` we need to establish a few things right away.
```javascript
'use strict';
module.exports.readPost = (event, context, callback) => {
}
```

This exposes a function to serverless, called `readPost` and passes it some key things that we will use. The `event` that called the function, the `conext` of that function, and the `callback` to return when we are done.
