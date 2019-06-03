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
import { TimeUnit } from '../enum';
import { BaseVector } from './base';
import * as IntUtil from '../util/int';
import { IterableArrayLike, Duration, DurationSecond, DurationMillisecond, DurationMicrosecond, DurationNanosecond } from '../type';

export class DurationVector<T extends Duration = Duration> extends BaseVector<T> {
    /** @nocollapse */
    public static from<T extends Duration = DurationMillisecond>(data: IterableArrayLike<number>, unit: T['unit'] = TimeUnit.MILLISECOND) {
        const values = IntUtil.Int64.convertArray(data);
        return Vector.new(Data.Duration(new Duration(unit), 0, values.length / 2, 0, null, values));
    }
}

export class DurationSecondVector extends DurationVector<DurationSecond> {}
export class DurationMillisecondVector extends DurationVector<DurationMillisecond> {}
export class DurationMicrosecondVector extends DurationVector<DurationMicrosecond> {}
export class DurationNanosecondVector extends DurationVector<DurationNanosecond> {}
