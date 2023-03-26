window.addEventListener("load", () => {
    const canvas = document.querySelector("#canvas1");
    const context = canvas.getContext("2d");

    canvas.width = 1280;
    canvas.height = 720;

    context.lineWidth = 3;
    context.fillStyle = "#F1503C";
    context.strokeStyle = "#231B1A";
    
    
    class Player {
        // Will hold all player logic
        constructor(options) {
            this.game = options.game;
            this.collision_x = this.game.width / 2; // position of the collision box
            this.collision_y = this.game.height / 2; // position of the collision box
            this.collision_radius = 40;

            this.speed_x = 0;
            this.speed_y = 0;

            this.distance_x = 0;
            this.distance_y = 0;

            this.speed_modifier = 7;

            this.image = document.querySelector("#bull");
            this.sprite_width = 255; // different obstacle in the image used
            this.sprite_height = 256;
            
            this.width = this.sprite_width;
            this.height = this.sprite_height;

            // adjust position according to collison radius 
            this.sprite_x, this.sprite_y;
            // get random obstacle
            this.frame_x = Math.floor(Math.random() * 4);
            this.frame_y = Math.floor(Math.random() * 3);
        }

        /**
         * 
         * @param {*} context for drawing on the canvas
         */
        draw(context) {
            this.drawImage(context)
            if (this.game.debug) {

                context.beginPath(); // to start circle drawing
                context.arc(this.collision_x, this.collision_y, this.collision_radius, 0, Math.PI * 2);
                context.save()
                context.fill();
                context.globalAlpha = 0.5;
                context.restore();
                context.stroke();
                
                // Draw a line towards where the player will move
                context.beginPath();
                context.moveTo(this.collision_x, this.collision_y);
                context.lineTo(this.game.mouse.x, this.game.mouse.y);
                context.stroke();
            }
        }

        update() {
            // find the angel according where the mouse is 
            
            this.distance_x = this.game.mouse.x - this.collision_x;
            this.distance_y = this.game.mouse.y - this.collision_y;
            const angle = Math.atan2(this.distance_y, this.distance_x);
            this.calcAngle(angle);
            const distance = Math.hypot(this.distance_y, this.distance_x)
            if (distance > this.speed_modifier) {
                this.speed_x = this.distance_x / distance || 0;
                this.speed_y = this.distance_y / distance || 0;
            } else {
                this.speed_x = 0;
                this.speed_y = 0;
            }
            this.collision_x += this.speed_x * this.speed_modifier;
            this.collision_y += this.speed_y * this.speed_modifier;
            this.sprite_x = this.collision_x - this.width / 2;
            this.sprite_y = this.collision_y - this.height / 2 - 100;

            // Horizontal boundries
            if (this.collision_x < this.collision_radius) 
                this.collision_x = this.collision_radius;
            else if (this.collision_x > this.game.width - this.collision_radius) 
                this.collision_x = this.game.width - this.collision_radius;
    
            // vertical boundries
            if (this.collision_y < this.game.top_margin + this.collision_radius)
                this.collision_y = this.game.top_margin + this.collision_radius;
            else if (this.collision_y > this.game.height + this.collision_radius)
                this.collision_y = this.game.height - this.collision_radius;
            this.game.obstacles.forEach(obstacle => {
                // distructuring assinment
                let [collision, distance, distance_x, distance_y, sum_of_radii] = this.game.checkCollision(this, obstacle);
                if (collision) {
                    const unit_x = distance_x / distance; // always between 0 and 1 x/hypotenus
                    const unit_y = distance_y / distance; // but since the two con be on different up or down the unit can be between -1 and 1

                    // push the player away from the obstacle center point 1px 
                    this.collision_x = obstacle.collision_x + (sum_of_radii + 1) * unit_x;
                    this.collision_y = obstacle.collision_y + (sum_of_radii + 1) * unit_y;
                }
            });
        }

        drawImage(context) {
            context.drawImage(this.image, this.frame_x * this.sprite_width, this.frame_y * this.sprite_height, 
                                this.sprite_width, this.sprite_height, this.sprite_x, this.sprite_y, this.width, this.height);
        }

        calcAngle(angle) {
            if (angle < -2.74 || angle > 2.74) this.frame_y = 6;
            else if (angle < -1.96) this.frame_y = 7;
            else if (angle < -1.17) this.frame_y = 0;
            else if (angle < -0.39) this.frame_y = 1;
            else if (angle < 0.39) this.frame_y = 2;
            else if (angle < 1.17) this.frame_y = 3;
            else if (angle < 1.96) this.frame_y = 4;
            else if (angle < 2.74) this.frame_y = 5;

        }
    }
    class Egg {
        constructor(options) {
            this.game = options.game;
            this.collision_radius = 40;
            this.margin = this.collision_radius * 2;
            this.collision_x = this.margin + (Math.random() * (this.game.width - this.margin * 2));
            this.collision_y = this.game.top_margin + (Math.random() * (this.game.height - this.game.top_margin - this.margin));


            this.image = document.querySelector("#egg");

            this.sprite_width = 110;
            this.sprite_height = 135;
            this.width = this.sprite_width;
            this.height = this.sprite_height;


        }

        draw(context) {
            this.drawImage(context);
            if (this.game.debug) {
                context.beginPath(); // to start circle drawing
                context.arc(this.collision_x, this.collision_y, this.collision_radius, 0, Math.PI * 2);
                context.save()
                context.fillStyle = "#E5E7E7";
                context.strokeStyle = "#FFFFFF";
                context.globalAlpha = 0.5;
                context.fill();
                context.stroke();
                context.restore();
            }
        }

        drawImage(context) {
            // context.drawImage(this.image, this.frame_x * this.sprite_width, this.frame_y * this.sprite_height, 
            //     this.sprite_width, this.sprite_height, this.sprite_x, this.sprite_y, this.width, this.height);
            context.drawImage(this.image,  this.sprite_x, this.sprite_y, this.width, this.height);
        }

        update() {
            this.sprite_x = this.collision_x - this.width / 2;
            this.sprite_y = this.collision_y - this.height / 2 - 30;
            // spread operator to mix one array onto other
            let collision_objects = [this.game.player, ...this.game.obstacles];
            collision_objects.forEach(object => {
                let [collision, distance, distance_x, distance_y, sum_of_radii] = this.game.checkCollision(this, object);
                if (collision) {
                    const unit_x = distance_x / distance;
                    const unit_y = distance_y / distance;
                    this.collision_x = object.collision_x + (sum_of_radii + 1) * unit_x;
                    this.collision_y = object.collision_y + (sum_of_radii + 1) * unit_y;
                }
            })
        }
    }
    class Obstacle {
        constructor(options) {
            this.game = options.game;
            this.collision_x = Math.random() * this.game.width; // position of the collision box
            this.collision_y = Math.random() * this.game.height; // position of the collision box
            this.collision_radius =  60;
            this.image = document.querySelector("#obstacle");
            
            this.sprite_width = 250; // different obstacle in the image used
            this.sprite_height = 250;
            
            this.width = this.sprite_width;
            this.height = this.sprite_height;
            // adjust position according to collison radius 
            this.sprite_x = this.collision_x - this.width / 2;
            this.sprite_y = this.collision_y - this.width / 2 - 70;
            // get random obstacle
            this.frame_x = Math.floor(Math.random() * 4);
            this.frame_y = Math.floor(Math.random() * 3);
        }
        draw(context) {
            this.drawImage(context)
            if (this.game.debug) {
                context.beginPath(); // to start circle drawing
                context.arc(this.collision_x, this.collision_y, this.collision_radius, 0, Math.PI * 2);
                context.save()
                context.fillStyle = "#E5E7E7";
                context.strokeStyle = "#FFFFFF";
                context.globalAlpha = 0.5;
                context.fill();
                context.stroke();
                context.restore();
            }
        }
        drawImage(context) {
            // 9 arguments: the image, source_x, source_y, source_width, source_height, position_x
            // position_y, width and height to draw
            context.drawImage(this.image, this.frame_x * this.sprite_width, this.frame_y * this.sprite_height, 
                                this.sprite_width, this.sprite_height, this.sprite_x, this.sprite_y, this.width, this.height);

        }

        update() {

        }
    }
    class Game {
        // Main logic of the web, 
        constructor(options) {
            this.canvas = options.canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.top_margin = 260; // so the obstacle don't appear in the background art sorta keeps them on the ground
            this.player = new Player({game: this});
            this.number_of_obstacles = 10;
            this.obstacles = [];
            this.max_number_of_eggs = 15;
            this.eggs = [];
            this.game_objects = [];
            this.debug = false;
            this.fps = 50;
            this.timer = 0;
            this.interval = 1000/this.fps;
            this.egg_timer = 0;
            this.egg_interval = 3000;
            this.mouse = {
                x: this.width / 2,
                y: this.height / 2,
                pressed: false,
            };
            canvas.addEventListener("mousedown", (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
            });

            canvas.addEventListener("mouseup", (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;
            });

            canvas.addEventListener("mousemove", (e) => {
                if (this.mouse.pressed) {
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                }
            });

            window.addEventListener("keydown", e => {
                if (e.key == "d") this.debug = !this.debug;
            })
        }
        render(context, delta_time) {
            if (this.timer > this.interval) {
                context.clearRect(0, 0, this.width, this.height);
                this.game_objects = [...this.eggs, ...this.obstacles, this.player];
                this.game_objects.sort((a, b) => a.collision_y - b.collision_y)
                this.game_objects.forEach(object => {
                    object.draw(context);
                    object.update();
                });
                // Sort the array of objects by their vertical position so they are rendered in visual order
                this.timer = 0;
            }
            this.timer += delta_time;
            if (this.egg_timer > this.egg_interval && this.eggs.length < this.max_number_of_eggs) {
                this.createEgg();
                this.egg_timer = 0;
            } else {
                this.egg_timer += delta_time;
            }
        }
        createEgg() {   
            this.eggs.push(new Egg({game: this}));
        }
        createObstacles() {
            let attempts = 0;
            // for (let i = 0; i < this.number_of_obstacles; i++) {
            //     this.obstacles.push(new Obstacle({game: this}))
            // }
            while (this.obstacles.length < this.number_of_obstacles && attempts < 500) {
                let test_obstacle = new Obstacle({game: this});
                let overlap = false;
                this.obstacles.forEach(obstacle => {
                    // compare center of two different circles, if the distance between the two centers is less than
                    // the sum of the radius of circle 1 and circle 2 it means they overlap
                    // if distance is same it means they are touching
                    // if distance is larger then they are away from each other
                    const distance_x = test_obstacle.collision_x - obstacle.collision_x;
                    const distance_y = test_obstacle.collision_y - obstacle.collision_y;
                    // the distance is the hypotunse
                    const distance = Math.hypot(distance_y, distance_x);
                    // add a minimum spacing distance between the obstacles
                    const distance_buffer = 150;
                    const sum_of_radii = test_obstacle.collision_radius + obstacle.collision_radius + distance_buffer;

                    if (distance < sum_of_radii) {
                        overlap = true;
                    }
                });
                const _margin = test_obstacle.collision_radius * 2;
                // test_obstacle.sprite_x > 0 so left edge is not hidden under left edge of canvas
                // obstacle sprite x is smaller than the canvas width so it not hidden under the right edge of the canvas
                // adding extra margin allows some wiggle room to go in between obstacles
                if (!overlap && test_obstacle.sprite_x > 0 && test_obstacle.sprite_x < this.width - test_obstacle.width &&
                        test_obstacle.collision_y > this.top_margin +_margin && test_obstacle.collision_y < this.height - _margin) {
                    this.obstacles.push(test_obstacle);
                }
                attempts++;
            }   
        }
        checkCollision(a, b) {
            // check distance between the center points of both objects
            const distance_x = a.collision_x - b.collision_x;
            const distance_y = a.collision_y - b.collision_y;
            const distance = Math.hypot(distance_y, distance_x);
            const sum_of_radii = a.collision_radius + b.collision_radius;
            return [distance < sum_of_radii, distance, distance_x, distance_y, sum_of_radii];
        }
    }

    const game = new Game({canvas: canvas});
    game.createObstacles();
    
    let last_time = 0;

    function animate(time_stamp) {
        const delta_time = time_stamp - last_time; // timestamp diffrence between this animation loop and the last one
        last_time = time_stamp;
        game.render(context, delta_time);
        requestAnimationFrame(animate)
    }
    animate(0);
})