HTMl Canvas:
Has 2 different sizes, element size and drawing surface size which can be se independently.

To not have any distortion we can set them to the same size.

The "context" object that we get from canvas.getContext("2d") contains all canvas properties and drawing options

In canvas the, the center or initial coordinates, depend on shape
circle => center of it
square or rectangle => top let corner
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
    - Will automatically try to adjust the refresh rate according to screen, usually 60fps
    - Will create a timestamp
Circle packing => algorithm to fit something "circles" in a certain area withouth there being an overlap between the items.

Brute force algrothims check manualy every time no items overlap, can slow down performance


Destructuring assignment:

JS expression that makes it possible to unpack values from arrays or objects into individual variables
    let [x, y, z] = [1, 2, 3];
    

To face the player toward the mouse, we have in the sprite image different frame that we can use accordingly

To know the angle where the mouse is pointing, we use the Math.atan2(y, x) =>Returns the angle (in radians) from the X axis to a point.
it will give value betwee -3.14 to 3.14, which 2*3.14 = 360deg, full circle

So total circumference is 6.24, and we have 8 frames => 6.28 / 8;