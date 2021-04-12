export function formatWppMarkdown(textRef) {
    if (textRef.current !== null) {
        let format = textRef.current.innerText;
        format = whatsappStyles(format, "_", "<i>", "</i>");
        format = whatsappStyles(format, "*", "<b>", "</b>");
        format = whatsappStyles(format, "~", "<s>", "</s>");

        if (format !== undefined) {
            format = format.replace(/\n/gi, "<br>");
        }

        textRef.current.innerHTML = format;
        whatsappLinkStyle(textRef);
    }
}

function is_aplhanumeric(c) {
    let x = c.charCodeAt(0);
    return ((x >= 65 && x <= 90) || (x >= 97 && x <= 122) || (x >= 48 && x <= 57));
}

function whatsappStyles(format, wildcard, opTag, clTag) {
    let indices = [];

    if (format !== undefined) {
        for (let i = 0; i < format.length; i++) {
            if (format[i] === wildcard) {
                if (indices.length % 2)
                    (format[i - 1] === " ") ? null : ((typeof (format[i + 1]) == "undefined") ? indices.push(i) : (is_aplhanumeric(format[i + 1]) ? null : indices.push(i)));
                else
                    (typeof (format[i + 1]) == "undefined") ? null : ((format[i + 1] === " ") ? null : (typeof (format[i - 1]) == "undefined") ? indices.push(i) : ((is_aplhanumeric(format[i - 1])) ? null : indices.push(i)));
            } else {
                (format[i].charCodeAt() === 10 && indices.length % 2) ? indices.pop() : null;
            }
        }
    }

    (indices.length % 2) ? indices.pop() : null;

    let e = 0;
    indices.forEach(function (v, i) {
        let t = (i % 2) ? clTag : opTag;
        v += e;
        format = format.substr(0, v) + t + format.substr(v + 1);
        e += (t.length - 1);
    });
    return format;
}

function whatsappLinkStyle(element) {
    if (element.current !== undefined) {
        let text = element.current.innerText;

        let pattern = new RegExp("^(https?:\\/\\/)?" +
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
            "((\\d{1,3}\\.){3}\\d{1,3}))" +
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
            "(\\?[;&a-z\\d%_.~+=-]*)?" +
            "(\\#[-a-z\\d_]*)?$", "i");

        if (pattern.test(text)) {
            element.current.innerHTML = `<a href="${text}" target="_blank" rel="noreferrer">${text}</a>`;
        }
    }
}