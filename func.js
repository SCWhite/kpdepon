$(document).ready(function () {

    // status register
    var stat = {
        ".pon": 0,
        ".ka": 0,
        "key": "-",
        "player": 0
    };

    // audio fx controller
    var controller = {
        play: function (id) {
            this.sounds[id].play();
            stat["key"] = id[1];
            setTimeout(function () {
                stat["key"] = "-";
            }, 100);
            if (0 !== stat[id]) {
                clearTimeout(stat[id])
                $(id).attr("src", "./imgs/init.jpg").removeClass("glowing");
                setTimeout(function () {
                    $(id).attr("src", "./imgs/down.jpg").addClass("glowing");
                }, 10);
                stat[id] = setTimeout(function () {
                    controller.reset(id);
                }, 80);
            } else {
                $(id).attr("src", "./imgs/animate.gif").addClass("glowing");
                setTimeout(function () {
                    $(id).attr("src", "./imgs/down.jpg").addClass("glowing");
                }, 80);
                stat[id] = setTimeout(function () {
                    controller.reset(id);
                }, 200);
            }
        },

        reset: function (id) {
            $(id).attr("src", "./imgs/init.jpg").removeClass("glowing");
            clearTimeout(stat[id])
            stat[id] = 0;
        },

        // sounds
        sounds: {
            ".pon": new Howl({
                buffer: true,
                urls: ["pon.wav"],
            }),
            ".ka": new Howl({
                buffer: true,
                urls: ["ka.wav"],
            })
        }

    };

    // expermintal player
    var player = {
        logRecordText: function (key) {
            $("#recordText").val($("#recordText").val() + key);
        },

        playRecordText: function (pos) {
            player.stopRecordText();
            var text = $("#recordText").val();
            if (pos > text.length) {
                return;
            }

            switch (text[pos]) {
            case "p":
                controller.play(".pon");
                break;
            case "k":
                controller.play(".ka");
                break;
            }

            stat["player"] = setTimeout(function () {
                player.playRecordText(pos+1);
            }, 100);
        },

        stopRecordText: function (pos) {
            clearInterval(stat["player"]);
            stat["player"] = 0;
            $("#recordText").val($("#recordText").val().replace(/^--+/, '-').replace(/--+$/, '-'));
        }
    };

    // youtube player
    var yt_player = {
        playBGM: function (vidId) {
            var player = new YT.Player('yt_video', {
                height: dimension[0] + 20,
                width: dimension[1] + 80,
                videoId: vidId,
                events: {
                    onReady: function(e) { e.target.playVideo(); },
                    onStateChange: function(e) {
                        if(e.data == YT.PlayerState.ENDED) { yt_player.setBGM(getBGMId(vidId)); }
                    }
                }
            });
            $("#yt_video").width(dimension[0] + 80).height(dimension[1] + 20).show();
            $(".ka").width(dimension[0]).height(dimension[1]);
        },

        setBGM: function (vidId) {
            $("#yt_video").hide();
            if("undefined" === typeof(vidId)) {
                var vidId = getBGMId();
            }

            $("#yt_video").replaceWith("<div id=\"yt_video\"></div>");
            yt_player.playBGM(vidId);
        }
    }

    // bind events
    $(document).keydown(function (e) {
        switch (e.which) {
        // x .
        case 88:
        case 190:
            controller.play(".pon");
            break;
        // a and '
        case 65:
        case 222:
            controller.play(".ka");
            break;
        // q
        case 81:
            var url = prompt("youtube url?");
            var vidId = url.match(/v=([^&]*)&?/)[1];
            yt_player.playBGM(vidId);
            break;
        // w
        case 87:
            var test = "p--p--p-p--p--p-p--p--p-k---k---p--p--p-p--p--p-k---k---p---k---k-k-ppp-k-k-pp \
                        p-k-k-ppp-p-ppp-p-k-k-ppp-k-k-ppp-p-k-k-k-kkk-k-k-k-k-ppp-k-k-ppp-k-k-ppp-p-pp \
                        p-p-p-kkk-ppp-k-kkkkk-kkk-k-k---p-p-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-p-k-k-ppp-k- \
                        k-ppp-p-k-k-k-kkk-k-k-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-p-ppp-kkk-p-p-k-k-p--p--p- \
                        pppp---p---k--kpkp-k-k-p---k---p-p-k---p---k--kpkp-k-k-p---k---ppp-k---p---k-- \
                        kpkp-k-k-p---k---p-p-k---p---k--kpkp-k---p---p---k---k---k---k---p---p---p--pp \
                        k-p-p-------p---p---k---k---k-kkp-p-p-ppk---k---k---p---p---p-ppk-p-p---p-p-p- \
                        p---p-p---p---p---p-p-----------k-ppk-p-k-ppk-p-kkk-p-p-k---p-p-p-kkp-k-p-kkp- \
                        k-p-ppk-p-k---p-p-k-ppk-p-k-ppk-p-kkk-p-p-k---p-p-k---k---k---k---p-p-p-p-p--- \
                        p-p-k-ppk-p-k-ppk-p-kkk-p-p-k---p-p-p-kkp-k-p-kkp-k-p-ppk-p-k----p-p-k-ppk-p-k \
                        -ppk-p-kkk-p-p-k---p-p-k---k---k---k---p-p-k-k-ppppppppp-ppppppppp-----p-p---- \
                        -----p-----p-p-----p-p---p-k-p-p-k-p-ppkkp-kkp-pp-pp-p-pp-pp-k-kk-kk-k-kk-kk-p \
                        -pp-pp-k-kk-kk-p-pp-pp-k-kk-kk-k-ppk-p-k-p-kkp-k-ppk-p-k-p-kkp-k-ppk-kkk-p-k-p \
                        -ppp---------------ppp-kkk-ppp-kkk-ppp-p-k-ppppppp-ppp-ppk-ppp-ppk-ppp-k-k-ppp \
                        pppp-p-k-ppk-p-k-ppk-p-k-ppk-ppppppp-p-k-ppk-kkp-ppk-k--k--k-ppppppp-k---k---p \
                        ---p---p-ppk-p-p-------p---p---k---k---k-kkp-p-p-ppk---k---k---p---p---p-ppk-p \
                        -p---p-p-p-p---p-p---p---p---p-p---------k-------------------------------k---- \
                        ---------------------------k---------------k---k---k---k---p-k-p-k-p---p-p-k-p \
                        pk-p-k-ppk-p-kkk-p-p-k---p-p-p-kkp-k-p-kkp-k-p-ppk-p-k---p-p-k-ppk-p-k-ppk-p-k \
                        kk-p-p-k---p-p-k-ppk-ppk-ppk---p-p-k-k-ppppppp-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-p \
                        -k-k-ppp-k-k-ppp-p-k-k-k-kkk-k-k-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-p-p-kkk-ppp-k-k \
                        kkkk-kkk-k-k---p-p-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-p-k-k-ppp-k-k-ppp-p-k-k-k-kkk \
                        -k-k-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-kkk-p-p-k-k-p--p--p-p---p---k--k--p-p";
            $("#recordText").val(test.replace(/[^-kp]/g, ''));
            break;
        }
    });

    var clickType = ((null !== document.ontouchstart)? "click":"touchstart");
    $(".pon").bind(clickType, function () {controller.play(".pon");});
    $(".ka").bind(clickType, function () {controller.play(".ka");});

    $("#btn_record").bind("click", function () {
        player.stopRecordText();
        $("#recordText").val("");
        stat["player"] = setInterval(function () {
            player.logRecordText(stat["key"]);
        }, 100);
    });

    $("#btn_play").bind("click", function () {
        player.playRecordText(0);
    });

    $("#btn_stop").bind("click", function () {
        player.stopRecordText();
    });

    // set sample
    var patterns = [
        "-p--p--k---ppp-p--k----p--p--k---ppp-p--k-kk-",
        "-p----k---p-p--p--k-----p----k---p-p--p--k-",
        "-p--p--k-----p--p--k-----p--p--k-----p--p--k-"
    ];

    var pattern = patterns[Math.floor(Math.random() * patterns.length)];
    $("#recordText").val(pattern);

    // layout
    var animationWidth = $("#animation").width();
    var dimension = [animationWidth / 4, animationWidth * 3 / 16];

    setTimeout(function () {
        $('#fb_like iframe:first').attr('src', $('#fb_like iframe:first').data('src'));
    }, 1000);

    $("#yt_video").hide();

    // if hash is given, extract ytid
    var str = window.location.hash.substr(1);
    try {
        var vidId = str.match(/v=([^&]*)&?/)[1];
        setTimeout(function() {
            yt_player.playBGM(vidId);
        }, 1000);
    } catch (err) {
        // do nothing
    }

});
