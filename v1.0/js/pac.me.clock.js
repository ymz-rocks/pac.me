Pac('clock', function (props, me, delegate)
{
    function progress(section, value)
    {
        props[section].back = { color: 'transparent' };

        props[section].end = 1; props[section].border.color = props.colors.back; me.draw.pie(props[section]);
        props[section].end = value; props[section].border.color = props.colors[section]; me.draw.pie(props[section]);
    }

    function now()
    {
        function format(n)
        {
            return (n < 10) ? '0' + n : n;
        }

        var now = new Date();

        var result =
        {
            hh: now.getHours(),
            mm: now.getMinutes(),
            ss: now.getSeconds(),
            ms: now.getMilliseconds()
        };

        result.time = format(result.hh) + ':' + format(result.mm) + ':' + format(result.ss);

        if (result.hh > 11) result.hh -= 12; result.hh /= 12; result.mm /= 60; result.ss /= 60;

        return result;
    }

    me.interval(4).play(function ()
    {
        var t = now();

        progress('hours', t.hh);
        progress('minutes', t.mm + (t.ss + 0.01) * 0.017);
        progress('seconds', t.ss + t.ms * 0.000017);

        props.second.end = 1; props.second.back.color = props.colors.digitsBack; me.draw.pie(props.second);
        props.second.end = (t.ms % 1000) * 0.001; props.second.back.color = props.colors.second; me.draw.pie(props.second);

        me.draw.text({ value: t.time, x: 122, y: 172, font: { size: 18 }, back: { color: props.colors.digits } });
    });

},
{
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