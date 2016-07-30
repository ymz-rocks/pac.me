/*
 * pac.me JavaScript Library v1.0
 * Copyright (c) 2016 ymz
 * Released under a Creative Commons Attribution 4.0 International License
 * https://github.com/ymz-rocks/pac.me/blob/master/LICENSE.md
 */

function Pac(id, handle, settings)
{
    var jsKey = "iACOZyXXZZWeWmehsRDfkvuJhfvDkZDqcwEdYlRJ";

    // inner utils  =========================================================================================== //
    this.center = function(point, handle)                                                                       //
    {                                                                                                           //
        ctx.translate(point.x, point.y); handle(); ctx.translate(-point.x, -point.y);                           //
    }                                                                                                           //
    this.copy = function(source, target)                                                                        //
    {                                                                                                           //
        if (source == null || typeof source != 'object') return source;                                         //
        if (!target) target = {};                                                                               //
        if (source instanceof Date)                                                                             //
        {                                                                                                       //
            instance = new Date();                                                                              //
            instance.setTime(source.getTime());                                                                 //
            return instance;                                                                                    //
        }                                                                                                       //
        if (source instanceof Array)                                                                            //
        {                                                                                                       //
            instance = [];                                                                                      //
            for (var i = 0, len = source.length; i < len; i++)                                                  //
            {                                                                                                   //
                instance[i] = me.copy(source[i]);                                                               //
            }                                                                                                   //
            return instance;                                                                                    //
        }                                                                                                       //
        if (source instanceof Object)                                                                           //
        {                                                                                                       //
            for (var attr in source)                                                                            //
            {                                                                                                   //
                if (source.hasOwnProperty(attr)) target[attr] = me.copy(source[attr], target[attr]);            //
            }                                                                                                   //
            return target;                                                                                      //
        }                                                                                                       //
        return undefined;                                                                                       //
    }                                                                                                           //
    this.data = function()                                                                                      //
    {                                                                                                           //
        var value = 'pac_' + jsKey;                                                                             //
        window[value] = me.fix(window[value], {}); return value;                                                //
    }                                                                                                           //
    this.fix = function(value, altr, def)                                                                       //
    {                                                                                                           //
        return (arguments.length == 3) ? ((value == altr) ? def : value) : (value) ? value : altr;              //
    }                                                                                                           //
    // ======================================================================================================== //

    // c'tor & globals  ======================================================================================= //
    function instance(me, id)                                                                                   //
    {                                                                                                           //
        function addEvent(element, eventName, fn)                                                               //
        {                                                                                                       //
            if (element.addEventListener)                                                                       //
                element.addEventListener(eventName, fn, false);                                                 //
            else if (element.attachEvent)                                                                       //
                element.attachEvent('on' + eventName, fn);                                                      //
            else element[eventName] = fn;                                                                       //
        }                                                                                                       //
        addEvent(window, 'load', function ()                                                                    //
        {                                                                                                       //
            canvas = document.getElementById(id); if (!canvas.getContext) return;                               //
            ctx = canvas.getContext('2d'); me.canvas = { x: canvas.width, y: canvas.height, scale: 1 };         //
            handle(me);                                                                                         //
        });                                                                                                     //
    }                                                                                                           //
    if (!id || !handle) return; var me = this;                                                                  //
    if (handle.length > 1) window[me.data()][id] = { invoke: handle, set: settings };                           //
    if (!Pac.prototype.isPrototypeOf(this)) return;                                                             //
    var canvas, ctx, loader = []; instance(this, id);                                                           //
    me.anim = { fps: 30, speed: 1, stop: false, pause: false };                                                 //
    // ======================================================================================================== //

    // methods ================================================================================================ //

    this.interval = function (value)
    {
        if (arguments.length == 0) return me.anim.interval;

        me.anim.interval = me.fix(value, me.anim.interval); return me;
    }

    this.fps = function (value)
    {
        if (arguments.length == 0) return me.anim.fps;

        me.anim.fps = me.fix(value, me.anim.fps); return me;
    }

    this.speed = function (value)
    {
        if (arguments.length == 0) return me.anim.speed;

        me.anim.speed = me.fix(value, me.anim.speed); return me;
    }

    this.scale = function (factor, handle)
    {
        if (arguments.length == 0) return me.canvas.scale;

        if (!handle) handle = function ()
        {
            canvas.width = me.canvas.x * factor; canvas.height = me.canvas.y * factor
        }

        if (factor && factor > 0)
        {
            handle(); me.canvas.scale = factor;
        }

        return me;
    }

    this.zoom = function (factor)
    {
        return (arguments.length == 0) ? me.canvas.scale : me.scale(factor, function ()
        {
            me.center({ x: canvas.width * .5, y: canvas.height * .5 }, function ()
            {
                ctx.scale(factor, factor); me.canvas.zoomed = true;
            });

        });
    }

    this.load = function (name, handle, invoke)
    {
        var obj = window[me.data()][name]; if (!obj || !obj.invoke) return;

        var o = typeof handle == 'object', set = me.copy(obj.set, {}); if (o) set = me.copy(handle, set);

        if (set) loader.push({ invoke: obj.invoke, set: set, delegate: (invoke) ? invoke : ((o) ? function () { } : handle) });
        else obj.invoke(me, handle);

        return me;
    }

    this.draw =
    {
        pie: function (props)
        {
            function convert(percentage, shift)
            {
                if (percentage > 1) percentage = 1;

                return ((percentage == 0) ? 0 : (percentage * 360 * (Math.PI / 180))) + me.fix(shift, 0);
            }

            var r = me.fix(props.r, 10), x = me.fix(props.x, 0), y = me.fix(props.y, 0), s = me.scale();

            if (s && !me.canvas.zoomed) { r *= s; x *= s; y *= s; }

            this.paint(props, function ()
            {
                var c = { x: x + r, y: y + r }, start = me.fix(props.start, 0), end = me.fix(props.end, 1), sub = end - start, shift = Math.PI * 1.5;
                
                if (sub == 0) sub = 1;

                if (start != 0) me.center(c, function ()
                {
                    ctx.rotate(convert(start));
                });

                var anti = (props.hasOwnProperty('anti')) ? props.anti : (typeof G_vmlCanvasManager != 'undefined' && start < end);

                ctx.arc(c.x, c.y, r, shift, convert(sub, shift), anti);

                if (props.back && props.back.color && props.back.color != 'transparent' && sub < 1)
                {
                    ctx.lineTo(c.x, c.y); return true;
                }

                return false;
            });

            return me.draw;
        },

        text: function (props)
        {
            this.paint(props, function ()
            {
                if (!props.value) return true;

                if (!props.font) props.font = {};

                props.font.size = me.fix(props.font.size, 28);
                props.font.name = me.fix(props.font.name, 'Verdana');

                var x = me.fix(props.x, 0), y = me.fix(props.y, 0), s = me.scale();

                if (me.scale() && !me.canvas.zoomed)
                {
                    x *= s; y *= s; props.font.size *= s;
                }

                if (ctx.font) ctx.font = props.font.size + 'pt ' + props.font.name;
                if (ctx.fillText) ctx.fillText(props.value, x, y + props.font.size);

                return true
            });
        },

        paint: function (props, draw)
        {
            function hex2rgba(hex)
            {
                hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (m, r, g, b)
                {
                    return r + r + g + g + b + b;
                });

                var val = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return val ?
                {
                    r: parseInt(val[1], 16),
                    g: parseInt(val[2], 16),
                    b: parseInt(val[3], 16)

                } : { r: 0, g: 0, b: 0 };
            }

            function alpha(hex, value)
            {
                if (value < 0) value = 0;
                else if (value > 1) value = 1;

                var rgb = hex2rgba(hex);

                return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + value + ')';
            }

            if (!draw) return; ctx.save(); var border = props.border && props.border.size > 0, back = props.back && props.back.color, shift = 0;
            
            if (border)
            {
                var line = me.fix(props.border.size, 1), s = me.scale(); if (s) line *= s;

                if (!me.canvas.zoomed) shift = line * .5;

                ctx.lineWidth = line;
                ctx.lineJoin = 'round';

                ctx.strokeStyle = me.fix(me.fix(props.border.color, '#929292'), 'transparent', undefined);
            }

            if (back)
            {
                props.back.color = me.fix(props.back.color, '#181818'); if (props.back.color == 'transparent' && typeof G_vmlCanvasManager != 'undefined') props.back.alpha = 0.001;
                if (ctx.fillStyle) ctx.fillStyle = (props.back.alpha) ? alpha(props.back.color, props.back.alpha) : props.back.color;
            }

            ctx.translate(shift, shift); ctx.beginPath(); if (draw()) ctx.closePath();

            ctx.fill();
            if (border) ctx.stroke();
            ctx.restore();

            if (me.canvas.zoomed)
            {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                me.canvas.zoomed = false;
            }

            return me.draw;
        }
    };

    this.play = function (handle, init, delegate)
    {
        me.anim.pause = me.anim.stop = false;

        var o = typeof handle == 'object';
        
        if (arguments.length == 0 || o)
        {
            if (o) init = me.copy(handle);
            handle = loader;
        }

        var bulk = typeof handle != 'function', play = (bulk) ? handle : [(handle) ? { invoke: handle } : loader[0]]; if (!play) return; //me.anim.handlers

        me.anim.handlers = play; 

        if (!bulk)
        {
            var handler = me.anim.handlers[0]; 

            handler.set = me.fix(init, me.fix(handler.set, {}));
            handler.delegate = me.fix(delegate, handler.delegate);
        }

        var loop = function ()
        {
            if (me.anim.stop)
            {
                me.anim.handlers = undefined; return;
            }

            if (me.anim.stop || me.anim.pause)
            {
                clearTimeout(me.anim.key);
            }
            else
            {
                me.clear();

                for (var i in me.anim.handlers)
                {
                    var handler = me.anim.handlers[i];

                    handler.invoke(handler.set, me, handler.delegate);
                }

                var rate = (me.interval()) ? me.interval() : (1 / (me.fps() * 0.001)) * (1 / me.speed());

                me.anim.key = setTimeout(loop, rate);
            }
        }

        loop(); return me;
    }

    this.clear = function ()
    {
        if (ctx.clearRect) ctx.clearRect(0, 0, canvas.width, canvas.height);
        else canvas.width = canvas.width;

        return me;
    }

    this.toggle = function ()
    {
        return (me.anim.pause) ? me.play() : me.pause();
    }

    this.pause = function ()
    {
        me.anim.pause = true; return me;
    }

    this.stop = function ()
    {
        me.anim.stop = true; return me;
    }

    this.random = function (from, to)
    {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }

    this.shuffle = function (obj)
    {
        for (var j, x, i = obj.length; i; j = Math.floor(Math.random() * i), x = obj[--i], obj[i] = obj[j], obj[j] = x); return obj;
    }
}
