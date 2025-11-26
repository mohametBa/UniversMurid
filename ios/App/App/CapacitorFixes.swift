//
//  CapacitorFixes.swift
//  App
//
//  Created by Mohamet on 17/11/2025.
//

import Foundation
import Foundation

#if !os(Linux)
let MSEC_PER_SEC: Int64 = 1000
let USEC_PER_SEC: Int64 = 1000000
let NSEC_PER_SEC: Int64 = 1000000000
#endif
