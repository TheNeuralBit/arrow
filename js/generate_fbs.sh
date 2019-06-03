#! /usr/bin/env sh

flatc --ts -o ${ARROW_HOME}/js/src/fb ${ARROW_HOME}/format/*.fbs

pushd ${ARROW_HOME}/js/src/fb

rm Tensor_generated.ts SparseTensor_generated.ts

mv File_generated.ts File.ts
mv Schema_generated.ts Schema.ts
mv Message_generated.ts Message.ts

# Comment out Tensor imports
sed -E 's/(.*(import|export).*Tensor.*)/\/\/\1/' *.ts -i

# Remove _generated from imports
sed -E 's/(.*(import|export).*)_generated(.*)/\1\3/' *.ts -i

# Add tslint statement to Schema.ts
echo "/* tslint:disable:class-name */" > Schema.ts.tmp
cat Schema.ts >> Schema.ts.tmp
mv Schema.ts.tmp Schema.ts

npm run lint

popd
