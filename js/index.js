/**
 * Created by wuyanhua on 2018/8/9.
 */
(function($){
    // 获取课程列表
    var url_classes="http://imoocnote.calfnote.com/inter/getClasses.php";

    // 获取章节URL
    var chapterUrl = 'http://imoocnote.calfnote.com/inter/getClassChapter.php'

    // 获取笔记URL
    var noteUrl = 'http://imoocnote.calfnote.com/inter/getClassNote.php'

    //全局错误处理函数
    $.ajaxSetup({
        error:function(){
            alert('调用接口失败');
            return;
        }
    });

    function refresh(curPage){
        $.getJSON(url_classes,{curPage:curPage},function(data){
            renderTemplate('#class-template',data.data,'#content');
            renderTemplate('#page-template',formatPage(data),'#page');
        });
    }

    $.getJSON(url_classes,{curPage:1},function(data){
        renderTemplate('#class-template',data.data,'#content');
        renderTemplate('#page-template',formatPage(data),'#page');
        $('#page').delegate('li','click',function(){
            var $this=$(this);
            var curPage=$this.data('id');
            refresh(curPage);
        })

    });

    $('.overlap').on('click',function(){
        showNote(false)
    })

    function bindClassevent(){
        $('#content').delegate('li','click',function(){
            var $this=$(this);
            var cid=$this.data('id');
            $.when($.getJSON(chapterUrl,{cid:cid}),$.getJSON(noteUrl,{cid:cid}))
                .done(function(data1,data2){
                    renderTemplate('#chapter-template',data1[0],'#chapter')
                    renderTemplate('#note-template',data2[0],'#note');
                    showNote(true);
                })
        })
    };
    bindClassevent();

    //渲染模版
    function renderTemplate(container,data,wrapper){
        var t=$(container).html();
        var f=Handlebars.compile(t);
        var h=f(data);
        $(wrapper).html(h);
    }

    //是否显示笔记本
    function showNote(show){
        if(show){
            $('.notedetail').show();
            $('.overlap').show();
        }else{
            $('.notedetail').hide();
            $('.overlap').hide();
        }
    };

    //是否有笔记
    Handlebars.registerHelper('equal',function(v1,v2,options){
        if(v1==v2){
            return options.fn(this)
        }else{
            return options.inverse(this)
        };
    });

    // 课程是否超过1小时
    Handlebars.registerHelper('isLong',function(v,options){
        if(v.indexOf('小时')!=-1){
            return options.fn(this)
        }else{
            return options.inverse(this)
        };
    });

    // 是否是视频课程
    Handlebars.registerHelper('isVideo',function(v,options){
        if(v=="video"){
            return options.fn(this)
        }else{
            return options.inverse(this)
        };
    });

    //格式话日期
    Handlebars.registerHelper('formatDate',function(v){
        if(!v){
            return ""
        };
        var date=new Date(v);
        var y=date.getFullYear();
        var m=date.getMonth()+1;
        var d=date.getDate();
        return y+'年'+m+'月'+d+'日'

    });

    // 是否有数据
    Handlebars.registerHelper('isEmpty', function(data, options) {
        if (data.length === 0) {
            return options.fn(this)
        } else {
            return options.inverse(this)
        }
    });

    // 索引+1
    Handlebars.registerHelper('addOne', function(v, options) {
        return v+1
    });

    function formatPage(pageDate){
        var arr=[];
        var total=parseInt(pageDate.totalCount);
        var cur=parseInt(pageDate.curPage);

        //处理首页的逻辑
        var toLeft={};
        toLeft.index=1;
        toLeft.text="<<";
        if(cur!=1){
            toLeft.clickable=true;
        };
        arr.push(toLeft);

        //处理上一页的逻辑
        var pre={};
        pre.index=-1;
        pre.text="<";
        if(cur!=1){
            pre.clickable=true;
        };
        arr.push(pre);

        //处理到cur前的逻辑
        if(cur<=5){
            for(var i=1;i<cur;i++){
                var page={};
                page.text=i;
                page.index=i;
                page.clickable=true;
                arr.push(page);
            }
        }else{
            //如果cur>5,那么cur前的要显示...
            var page={};
            page.text=1;
            page.index=1;
            page.clickable=true;
            arr.push(page);

            var page={};
            page.text='...';
            arr.push(page);

            for(var i=cur-2;i<cur;i++){
                var page={};
                page.text=i;
                page.index=i;
                page.clickable=true;
                arr.push(page);
            }
        };
        //
        var page={};
        page.text=cur;
        page.index=cur;
        page.clickable=true;
        arr.push(page);
        if(cur>=total-4){
            for(var i=cur+1;i<=total;i++){
                var page={};
                page.text=i;
                page.index=i;
                page.clickable=true;
                arr.push(page);
            }
        }else{
            for(var i=cur+1;i<=cur+2;i++){
                var page={};
                page.text=i;
                page.index=i;
                page.clickable=true;
                arr.push(page);
            };
            var page={};
            page.text='...';
            arr.push(page);

            var page={};
            page.text=total;
            page.index=total;
            page.clickable=true;
            arr.push(page)

        };

        //下一页
        var next={};
        next.index=cur+1;
        next.text=">";
        if(cur!=1){
            next.clickable=true;
        };
        arr.push(next);

        //尾页
        var toRight={};
        toRight.index=cur+1;
        toRight.text=">>";
        if(cur!=1){
            toRight.clickable=true;
        };
        arr.push(toRight);
        console.log(arr)
        return arr;
    };

})(jQuery)