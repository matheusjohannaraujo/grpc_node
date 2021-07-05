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

function Add(call, callback) {
  callback(null, { sum: call.request.a + call.request.b });
}

async function Fib(call) {
  const num = call.request.input;
  const CalcFib = num => num <= 1 ? num : CalcFib(num - 1) + CalcFib(num - 2);
  for (let i = 1; i <= num; i++) {
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 500);
    });
    call.write({ output: CalcFib(i) });
  }
  call.end();
}

function main() {
  const server = new grpc.Server();
  server.addService(proto_math.Greeter.service, { Add, Fib });
  server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log("Server Running...");   
  });
  setTimeout(() => {
    process.exit(1);
  }, 10000);
}

main();
