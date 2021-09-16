function scheduleHtmlParser(html) {
    var courseInfos_json = [];
    var $ = cheerio.load(html, { decodeEntities: false });
    $(".oldschedule #Table1 tr td").each(function(td) { //行读取模式,遍历传入所有表格中最里面的所有td标签
//         console.log($(this).html()) //debug
        if (td > 1) {
            courseInfos = getCourseInfos($(this).html())
            if (JSON.stringify(courseInfos) !== '{}') { //判断这个td是否有课程信息,有的话往courseInfos_json写入json
                courseInfos_json.push(courseInfos);
            }
        }
    })


    var sectionTimes_json = [
        { "section": 1, "startTime": "08:00", "endTime": "08:45" },
        { "section": 2, "startTime": "08:50", "endTime": "09:35" },
        { "section": 3, "startTime": "09:50", "endTime": "10:35" },
        { "section": 4, "startTime": "10:40", "endTime": "11:25" },
        { "section": 5, "startTime": "11:30", "endTime": "12:15" },
        { "section": 6, "startTime": "13:30", "endTime": "14:15" },
        { "section": 7, "startTime": "14:20", "endTime": "15:05" },
        { "section": 8, "startTime": "15:20", "endTime": "16:05" },
        { "section": 9, "startTime": "16:10", "endTime": "16:55" },
        { "section": 10, "startTime": "18:30", "endTime": "19:15" },
        { "section": 11, "startTime": "19:20", "endTime": "20:05" },
        { "section": 12, "startTime": "20:10", "endTime": "20:55" },
    ]

    console.log(courseInfos_json)
    var conss = new Object();
    conss.courseInfos = courseInfos_json;
    conss.sectionTimes = sectionTimes_json;
    return conss;
}

function getCourseInfos(td) {
    str = td.match(".*<br>.*") //通过中间是否有<br>来判断是否有课程信息
    var courseInfos = new Object();
    if (str) {
        info = str[0].split("<br>")
        name = info[0]
        position = info[3]
        teacher = info[2]

        weekinterval = info[1].match(/\d+\-\d+/g) //正则匹配一下吧,省的有些宝贝不是默认1-17周
        startweek = parseInt(weekinterval[0].split('-')[0])
        endweek = parseInt(weekinterval[0].split('-')[1])
        weekArray = []
        for (i = startweek; i <= endweek; i++) {
            weekArray.push(i);
        }

        switch (info[1][1]) {
            case '一':
                day = 1;
                break;
            case '二':
                day = 2;
                break;
            case '三':
                day = 3;
                break;
            case '四':
                day = 4;
                break;
            case '五':
                day = 5;
                break;
            case '六':
                day = 6;
                break;
            case '七':
                day = 7;
                break;
        }
        courseInfos.name = name;
        courseInfos.position = position;
        courseInfos.teacher = teacher;
        courseInfos.weeks = weekArray;
        courseInfos.day = day;
        sections=[]
        section=info[1].match(/第.*节/g)
        for(i=parseInt(section[0][1]);i<=parseInt(section[0].substr(-2,1));i++){
            s=new Object();
            s.section=parseInt(i)
            sections.push(s)
        }
        courseInfos.sections=sections
    }
    return courseInfos
}
