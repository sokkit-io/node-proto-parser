# parse-proto example usage

Be sure to check out the [readme](./README.md) first.

## Instructions

Clone the repository and install dependencies if you haven't already:

```sh
$ git clone -b main https://github.com/sokkit-io/parse-proto.git
$ cd ./parse-proto
$ npm install
```

Now, check out the [proto/in](./proto/in) directory contents. You'll see an `entity.proto` file with proto messages and a service.
This is the file we'll be parsing.

Next, we'll make one small change to [parse-proto.ts](./src/parse-proto.ts#L10) on **line 10** to see how it works with our sample `.proto` file:
```diff
- const ENV_FILE = '.env';
+ const ENV_FILE = '.env.example';
```

Finally, run the `parse-proto` script:

```sh
$ npm run parse-proto
```

## Output

The output of the `parse-proto` script is a compiled JavaScript module and TypeScript definition.

```sh
$ cd ./example/out && ls
entity.1_0_0.compiled.proto.js  entity.1_0_0.compiled.proto.d.ts
```

You can then copy the compiled JavaScript module and TypeScript definition to your project and use them as you see fit.
