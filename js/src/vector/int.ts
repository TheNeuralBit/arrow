// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import { Data } from '../data';
import { Vector } from '../vector';
import { BaseVector } from './base';
import { vectorFromValuesWithType } from './index';
import { VectorType as V } from '../interfaces';
import { Int, Uint8, Uint16, Uint32, Uint64, Int8, Int16, Int32, Int64 } from '../type';
import {
    toInt8Array, toInt16Array, toInt32Array,
    toUint8Array, toUint16Array, toUint32Array,
    toBigInt64Array, toBigUint64Array
} from '../util/buffer';

/** @ignore */
export class IntVector<T extends Int = Int> extends BaseVector<T> {

    public static from(this: typeof IntVector, data: Int8Array): Int8Vector;
    public static from(this: typeof IntVector, data: Int16Array): Int16Vector;
    public static from(this: typeof IntVector, data: Int32Array): Int32Vector;
    public static from(this: typeof IntVector, data: Uint8Array): Uint8Vector;
    public static from(this: typeof IntVector, data: Uint16Array): Uint16Vector;
    public static from(this: typeof IntVector, data: Uint32Array): Uint32Vector;

    // @ts-ignore
    public static from(this: typeof IntVector, data: Int32Array): Int64Vector;
    public static from(this: typeof IntVector, data: Uint32Array): Uint64Vector;
    public static from<T extends Int>(this: typeof IntVector, data: T['TArray']): V<T>;

    public static from(this: typeof Int8Vector,   data: Int8['TArray']   | Iterable<number>): Int8Vector;
    public static from(this: typeof Int16Vector,  data: Int16['TArray']  | Iterable<number>): Int16Vector;
    public static from(this: typeof Int32Vector,  data: Int32['TArray']  | Iterable<number>): Int32Vector;
    public static from(this: typeof Int64Vector,  data: Int32['TArray']  | Iterable<number>): Int64Vector;
    public static from(this: typeof Uint8Vector,  data: Uint8['TArray']  | Iterable<number>): Uint8Vector;
    public static from(this: typeof Uint16Vector, data: Uint16['TArray'] | Iterable<number>): Uint16Vector;
    public static from(this: typeof Uint32Vector, data: Uint32['TArray'] | Iterable<number>): Uint32Vector;
    public static from(this: typeof Uint64Vector, data: Uint32['TArray'] | Iterable<number>): Uint64Vector;

    /** @nocollapse */
    public static from<T extends Int>(input: T['TArray']) {
        let type: Int | null;
        switch (this) {
            case Int8Vector:   type = new Int8();   break;
            case Int16Vector:  type = new Int16();  break;
            case Int32Vector:  type = new Int32();  break;
            case Int64Vector:  type = new Int64();  break;
            case Uint8Vector:  type = new Uint8();  break;
            case Uint16Vector: type = new Uint16(); break;
            case Uint32Vector: type = new Uint32(); break;
            case Uint64Vector: type = new Uint64(); break;
            case IntVector:
            default:
                type = null;
        }
        let input_type: Int | null;
        switch (input.constructor) {
            case Int8Array:   input_type = new Int8();   break;
            case Int16Array:  input_type = new Int16();  break;
            case Int32Array:  input_type = new Int32();  break;
            case Uint8Array:  input_type = new Uint8();  break;
            case Uint16Array: input_type = new Uint16(); break;
            case Uint32Array: input_type = new Uint32(); break;
            default:          input_type = null;
        }

        let output_type: Int;
        if (type !== null) {
            output_type = type;
        } else if (input_type !== null) {
            output_type = input_type;
        } else {
            throw new TypeError("IntVector.from output type cannot be inferred. Try using a type specialization like Int32Vector.from, or calling IntVector.from with a TypedArray instance.");
        }

        const input_type_matches_output: boolean = (output_type != null && input_type != null && output_type.compareTo(input_type));
        // If the input is an ArrayBuffer or a TypedArray of the same type as
        // the output, create a vector referencing it (zero-copy).
        if (input instanceof ArrayBuffer || input_type_matches_output) {
            switch (output_type.constructor) {
                case Int8:   input = toInt8Array(input);   break;
                case Int16:  input = toInt16Array(input);  break;
                case Int32:  input = toInt32Array(input);  break;
                case Int64:  input = toInt32Array(input);  break;
                case Uint8:  input = toUint8Array(input);  break;
                case Uint16: input = toUint16Array(input); break;
                case Uint32: input = toUint32Array(input); break;
                case Uint64: input = toUint32Array(input); break;
            }
            return Vector.new(Data.Int(output_type, 0, input.length, 0, null, input))
        }
        return vectorFromValuesWithType(() => output_type, input);
    }
}

/** @ignore */
export class Int8Vector extends IntVector<Int8> {}
/** @ignore */
export class Int16Vector extends IntVector<Int16> {}
/** @ignore */
export class Int32Vector extends IntVector<Int32> {}
/** @ignore */
export class Int64Vector extends IntVector<Int64> {
    public toBigInt64Array() {
        return toBigInt64Array(this.values);
    }
    // @ts-ignore
    private _values64: BigInt64Array;
    public get values64(): BigInt64Array {
        return this._values64 || (this._values64 = this.toBigInt64Array());
    }
}

/** @ignore */
export class Uint8Vector extends IntVector<Uint8> {}
/** @ignore */
export class Uint16Vector extends IntVector<Uint16> {}
/** @ignore */
export class Uint32Vector extends IntVector<Uint32> {}
/** @ignore */
export class Uint64Vector extends IntVector<Uint64> {
    public toBigUint64Array() {
        return toBigUint64Array(this.values);
    }
    // @ts-ignore
    private _values64: BigUint64Array;
    public get values64(): BigUint64Array {
        return this._values64 || (this._values64 = this.toBigUint64Array());
    }
}
