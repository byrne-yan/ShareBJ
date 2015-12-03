[![Circle CI](https://circleci.com/gh/byrne-yan/ShareBJ/tree/devel.svg?style=shield&circle-token=bd1af33cae573bc642c2ef22388c1b341f650d9d)](https://circleci.com/gh/byrne-yan/ShareBJ/tree/devel)

ShareBJ（分享宝宝日记）是一个开源的、实时的家庭社交应用。通过ShareBJ, 宝宝的成长精彩瞬间可以通过文字、照片存储在云端。这些精彩瞬间不再会因为手机遗失、损坏而丢失。

**注**：ShareBJ是个beta阶段软件。它的绝大多数功能应该都能使用，但仍然存在一些未琢磨的地方，你很有可能会发现一些BUG。使用时请自己承担风险:)

注意ShareBJ遵循[GPL协议](https://www.gnu.org/licenses/gpl-2.0.html), 意味你打算将本项目运用于商业目的时，你的项目也必须是GPL开源。

# Features/功能


1. 数据云中保存，永不担心丢失
1. 文字、照片记录宝宝成长瞬间
1. 一人上传，亲朋实时可见
1. 本地照片缓存，离线仍可使用


# Usage/使用
To run ShareBJ, clone the repo and type:

`./run.sh`

To test end-to-end tests locally, type:

`./run.sh --test`

To test packages, type:

`./run.sh test-packages`

## SMS/短信通知服务
需要申请一个[haoservie的短信ＡＰＩ服务](http://www.haoservice.com/docs/17), 替换settings.json里haoserver对象key及相应模板ＩＤ:

```
  "haoservice":{
    "key":"pk_5b35e03165b8ba1",

```
