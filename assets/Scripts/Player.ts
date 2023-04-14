const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    Direction = 0;

    @property
    Velocity_Max_X = 0;

    @property
    Walk_Force = 0;

    @property
    Jump_Force = 0;

    private Rigid_Body;
    private isJumping: boolean;

    onLoad(){
        //set physics
        let physics_manager = cc.director.getPhysicsManager();
        physics_manager.enabled = true;
        physics_manager.gravity = cc.v2(0,-2000);

        this.Rigid_Body = this.node.getComponent(cc.RigidBody);

        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    }

    start () {
        this.isJumping = false;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event) {
        // set a flag when key pressed
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.Direction = -1;
                break;
            case cc.macro.KEY.d:
                this.Direction = 1;
                break;
            case cc. macro.KEY.w:
                if(!this.isJumping){
                    this.Rigid_Body.applyForceToCenter(cc.v2(0,this.Jump_Force),true);
                    this.isJumping = true;
                }
                break;
        }
    }

    onKeyUp(event) {
        // unset a flag when key released
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.d:
                this.Direction = 0;
                break;
        }
    }

    moveAround(dt){
        if(this.Direction>0&&this.Rigid_Body.linearVelocity.x<this.Velocity_Max_X||
            this.Direction<0&&this.Rigid_Body.linearVelocity.x>-this.Velocity_Max_X){
                this.Rigid_Body.applyForceToCenter(cc.v2(this.Direction*this.Walk_Force,0),true);
            }
    }

    onBeingContact(contact,other, self){
        console.log(`Collided with ${other.node.name}!`);
        if(self.tag === 2){
            this.isJumping = false;
        }
    }

    update (dt) {
        this.moveAround(dt);        
    }
}