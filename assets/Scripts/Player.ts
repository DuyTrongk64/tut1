const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    speed = 0;

    // Main character's jump height
    @property
    jumpHeight = 0;

    // Main character's jump duration
    @property
    jumpDuration = 0;

    @property
    moveSpeed = 0;

    private goLeft: boolean;
    private goRight: boolean;

    private _curJumpTime: number = 0;
    private _jumpTime = 2* this.jumpDuration;

    private statrJump: boolean;
    private isJumping: boolean;
    
    private canDrop: boolean;

    private phys = cc.director.getPhysicsManager();
    private velocity = new cc.Vec3(0, 0, 0);
    onKeyDown(event) {
        // set a flag when key pressed
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.goLeft = true;
                break;
            case cc.macro.KEY.d:
                this.goRight = true;
                break;
            case cc.macro.KEY.w:
                this.statrJump = true;
                break;
        }
    }

    onKeyUp(event) {
        // unset a flag when key released
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.goLeft = false;
                break;
            case cc.macro.KEY.d:
                this.goRight = false;
                break;
            case cc.macro.KEY.w:
                this.statrJump = false;
                break;
        }
    }

    runJumpAction () {
        var jumpUp = cc.tween().by(this.jumpDuration, {y: this.jumpHeight}, {easing: 'sineOut'});
        return jumpUp;
    }

    moveAround(dt){
        let direction = new cc.Vec3(0, 0, 0);
        if (this.goLeft) {
            direction.x -= 1;
        } 
        if (this.goRight) {
            direction.x += 1;
        }

        if (direction.magSqr() > 0) {
            direction.normalize();
            let newPosition = this.node.position.add(direction.multiplyScalar(this.speed * dt));
            this.node.setPosition(newPosition);
        }
    }

    onCollisionEnter(other: cc.PhysicsCollider, self: cc.PhysicsCollider){
        console.log(`Collided with ${other.node.name}!`);
        if(other.node.name == 'ground'){
            this.canDrop = true;
        }
    }

    setVelocity(dt){

        if(this.canDrop){
            this.velocity.y += -cc.director.getPhysicsManager().gravity.y * dt;

            // Move the node based on the velocity
            const newPos = this.node.position.add(this.velocity.multiplyScalar(dt));
            this.node.setPosition(newPos);
        }
        
    }
    onLoad(){
        //set physics
        
        this.phys.enabled = true;
        
        let rigidBody = this.node.getComponent(cc.RigidBody);
        rigidBody.enabledContactListener = true;
        
        
    }
    start () {
        this.goLeft = false;
        this.goRight = false;
        this.statrJump = false;
        this.isJumping = false;
        this.canDrop = true;

        this.phys.gravity = cc.v2(0, -20);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    update (dt) {
        this.moveAround(dt);
        //this.setVelocity(dt);
        console.log(`canDrop is ${this.canDrop}`);
        if(this.statrJump){
            this.statrJump = false;
            var jumpAction = this.runJumpAction();
            cc.tween(this.node).then(jumpAction).start()
        }
    }
}