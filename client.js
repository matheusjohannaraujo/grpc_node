const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};
const packageDefinitionMath = protoLoader.loadSync(__dirname + '/math.proto', options);
const proto_math = grpc.loadPackageDefinition(packageDefinitionMath).math;

function main() {
  const target = "localhost:50051";
  const auth = grpc.credentials.createInsecure();
  const client = new proto_math.Greeter(target, auth);
  client.Add({ a: 5, b: 3 }, function(err, response) {
    console.log("Add:", response.sum);
  });
  client.Fib({ input: 10 }).on("data", function(response) {
    console.log("Fib:", response.output);
  });
  setTimeout(() => {
    process.exit(1);
  }, 10000);
}

main();
