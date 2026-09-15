// Subject mask for a product photo, using Apple Vision's on-device
// "lift subject from background" (macOS 14+). No network, no model download.
//
//   swift scripts/product-images/lift.swift SOURCE.png OUT_DIR
//
// Writes OUT_DIR/mask.png: a full-resolution, soft, 8-bit mask of every
// foreground instance (the machine with its hoses and feet).
import CoreImage
import Foundation
import Vision

let args = CommandLine.arguments
guard args.count == 3 else {
  print("usage: swift lift.swift SOURCE.png OUT_DIR")
  exit(2)
}
let handler = VNImageRequestHandler(url: URL(fileURLWithPath: args[1]))
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let result = request.results?.first else {
  print("no foreground subject found")
  exit(1)
}
let mask = try result.generateScaledMaskForImage(forInstances: result.allInstances, from: handler)
let image = CIImage(cvPixelBuffer: mask)
let out = URL(fileURLWithPath: args[2]).appendingPathComponent("mask.png")
try CIContext().writePNGRepresentation(
  of: image, to: out, format: .L8, colorSpace: CGColorSpace(name: CGColorSpace.linearGray)!)
print("instances: \(result.allInstances.count), mask: \(Int(image.extent.width))x\(Int(image.extent.height))")
