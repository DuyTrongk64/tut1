const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onCollisionEnter(other: cc.PhysicsCollider, self: cc.PhysicsCollider){
        console.log(`Collided with ${other.node.name}!`);
        if(other.node.name == 'PurpleMonster'){
            this.node.destroy();
        }
    }

    onLoad () {
         
    }

    start () {

    }

    // update (dt) {}
}
