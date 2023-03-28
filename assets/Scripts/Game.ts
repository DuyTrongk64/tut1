const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    starPrefab: cc.Prefab= null;

    @property(cc.Node)
    playerNode: cc.Node= null;

   

    onLoad () {}

    start () {

    }

    update (dt) {}
}
