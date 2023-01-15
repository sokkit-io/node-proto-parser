# parse-proto

**Parse .proto files to compiled JavaScript modules and TypeScript definitions.**

## Usage

Clone the repository and install dependencies:

```sh
git clone -b main https://github.com/sokkit-io/parse-proto.git
cd ./parse-proto
npm install
```

Set up your environment variables:

```sh
cp .env.example .env
```
**Note:** Make sure to update the `.env` file to reflect your local environment variables.

Run the `parse-proto` command to parse a `.proto` file:

```sh
npm run parse-proto
```

## Example
To see how `parse-proto` works, check out the [example](./example) directory.
