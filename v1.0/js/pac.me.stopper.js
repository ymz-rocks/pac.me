Pac('stopper', function (props, me, delegate)
{
    function progress(section, value)
    {
        if (value > 0)
        {
            delete props[section].anti; props[section].end = 1; props[section].back = { color: 'transparent' }; props[section].border.color = props.colors.back; me.draw.pie(props[section]);
            props[section].anti = false; props[section].end = (props.up) ? 1 - value : value; props[section].border.color = props.colors[section]; me.draw.pie(props[section]);
        }
    }

    function now(value)
    {
        function format(n)
        {
            return (n < 10) ? '0' + n : n;
        }

        var now = new Date(value);

        var result =
        {
            hh: now.getHours(),
            mm: now.getMinutes(),
            ss: now.getSeconds(),
            ms: now.getMilliseconds(),
            ticks: now.getTime()
        };

        result.time = format(result.hh) + ':' + format(result.mm) + ':' + format(result.ss);

        result.mm /= 60; result.ss /= 60;

        return result;
    }

    function draw(t, p)
    {
        progress('hours', p);
        progress('minutes', t.mm + (t.ss + 0.01) * 0.017);
        progress('seconds', t.ss + t.ms * 0.000017);
    }

    var time = new Date(0, 0, 0, props.time.hours, props.time.minutes, props.time.seconds, 0), start;
    var total = time.getHours() * 3600000 + time.getMinutes() * 60000 + time.getSeconds() * 1000 + time.getMilliseconds();

    me.interval(4).play(function ()
    {
        props.second.end = 1; props.second.back.color = props.colors.digitsBack; me.draw.pie(props.second);

        if (props.freeze && props.freeze())
        {
            draw(now(time.getTime()), 1);

            me.draw.text({ value: now(time.getTime()).time, x: 122, y: 172, font: { size: 18 }, back: { color: props.colors.digits } });

            return;
        }

        if (!start) start = now(time.getTime() + new Date().getTime())

        var m = start.ticks - new Date(), d = time.getTime() - m, t = now(time.getTime() - d), p = 1 - d / total;

        if (p < 0.00001)
        {
            me.stop();

            progress('seconds', 1);
            me.draw.text({ value: now(time.getTime()).time, x: 122, y: 172, font: { size: 18 }, back: { color: props.colors.digits } });

            if (delegate) delegate();
        }
        else
        {
            draw(t, p);

            props.second.end = (d % 1000) * 0.001; props.second.back.color = props.colors.second; me.draw.pie(props.second);

            me.draw.text({ value: t.time, x: 122, y: 172, font: { size: 18 }, back: { color: props.colors.digits } });
        }
    });

},
{
    time:
    {
        hours: 22, minutes: 15, seconds: 47
    },

    colors:
    {
        hours: '#2997f2', minutes: '#28d9ed', seconds: '#29b6f6', second: '#cecece',

        back: '#535355', digits: '#2a2a2a', digitsBack: '#efefef'
    },

    hours:
    {
        r: 160,
        border: { size: 40 },
    },

    minutes:
    {
        r: 125, x: 47, y: 47,
        border: { size: 16 },
    },

    seconds:
    {
        r: 100, x: 68, y: 68,
        border: { size: 24 },
    },

    second:
    {
        r: 80, x: 100, y: 100, back: {}
    }

});