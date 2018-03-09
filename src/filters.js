const keyCodes = {
    enter: 13,
    tab: 9,
    delete: 46,
    up: 38,
    left: 37,
    right: 39,
    down: 40
}

module.exports = {
    capitalize: function (value) {
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
    },

    uppercase: function (value) {
        return value && value.toUpperCase()
    },

    key(handler, codeName) {
        const code = keyCodes[codeName] || codeName
        // if(!code) return;
        return (e) => {
            if(e.event.keyCode !== code) return;
            handler(e)
        }
    }

}