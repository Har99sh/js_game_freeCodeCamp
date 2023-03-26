HTMl Canvas:
Has 2 different sizes, element size and drawing surface size which can be se independently.

To not have any distortion we can set them to the same size.

The "context" object that we get from canvas.getContext("2d") contains all canvas properties and drawing options

Methods:
    fillStyle(color)
    fill()

    lineWidth(width)
    strokeStyle(color)
    stroke()

    save() => Saves the current context configuration and then are able to restore
    restore()

    globalAlpha(alpha) => Changes the opcity

Animation loop function to loop and update the page to create illusion of movement

window.requestAnimationFrame(fuctionForLoopingName)

Circle packing => algorithm to fit something "circles" in a certain area withouth there being an overlap between the items.

Brute force algrothims check manualy every time no items overlap, can slow down performance


Destructuring assignment:

JS expression that makes it possible to unpack values from arrays or objects into individual variables
    let [x, y, z] = [1, 2, 3];
    