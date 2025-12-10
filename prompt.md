Ok so lets do some thinking first. Can you analyze the repo. I'm building a game engine and teaching how to build it in a series of steps.
Each step is a branch, and we're first working on creating a platform game, mario style.
We have now covered the basics for that and have added projectiles, and now sprites.
Sprites + game menus will finish of the basics.
Then we'll add game specific branches. First a twin stick shooter branch, with no physics on player, limited game area and aim with mouse (or auto aim, auto shoot), and well do a upgrade system.
After that step we will have a space shooter / dodge things that fall from the sky game where we can introduce a boss mechanic.
But for now, sprites. So I want your input on how to load images, should we use vites assets and just import the images we need.
And then, should we do a sprite class or just load the images in the constructor for the actual object (I think this might be easiest).
Then I want to add spriet animation, where we load a sprite or several. We have a state that switches between the images or rows in an array.
The actual animation we make with drawImage and just move the frame and control what we draw. 
So no changes, just give me your suggestions.