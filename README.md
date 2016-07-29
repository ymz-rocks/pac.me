![](https://github.com/ymz-rocks/pac.me/blob/master/demos/img/pac.me.png)

# pac.me
html canvas javascript utility for simple &amp; fun animations

More information coming soon.. in the meanwhile please reffer to the samples attached to the library.

----

**Support:** 
Chrome, Firefox, Saffari, IE (partially supported with exCanvas)

----

##Live Samples: (jsFiddle)##
* [bubbles](https://jsfiddle.net/fcohLqxw/embedded/result/)
* [pacman](https://jsfiddle.net/y94ega12/embedded/result/)

----

##Basic usage:##
```
new Pac('id', function (me) // id => the id of the canvas element
{
    // your code here
});
```

for instance:

```
new Pac('id', function (me) 
{
    me.draw.pie({ x: 10, y: 10, r: 50, back: { color: '#29b6f6', alpha: 0.8 } });
});
```





