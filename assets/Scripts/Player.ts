const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    speed = 0;

    // Main character's jump height
    @property
    jumpHeight = 0

    // Main character's jump duration
    @property
    jumpDuration = 0


    private goLeft: boolean;
    private goRight: boolean;
    private jump: boolean;
    private inJump: boolean;
     
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
                this.jump = true;
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
                this.jump = false;
                break;
        }
    }

    runJumpAction () {
        // Jump up
        var jumpUp = cc.moveBy(this.jumpDuration,cc.v2(0, this.jumpHeight))
        // Jump down
        var jumpDown = cc.moveBy(this.jumpDuration,cc.v2(0,- this.jumpHeight))

        // Create a easing and perform actions in the order of "jumpUp", "jumpDown"
        
        return cc.sequence(jumpUp, jumpDown);
    }

    start () {
        this.goLeft = false;
        this.goRight = false;
        this.jump = false;
        this.inJump = false;
        this.speed = 500;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    update (dt) {
        let direction = new cc.Vec3(0, 0, 0);
        if (this.goLeft) {
            direction.x -= 1;
        } 
        if (this.goRight) {
            direction.x += 1;
        }
        if(!this.inJump){
            if (this.jump){
                var jumpAction = this.runJumpAction();
                this.node.runAction(jumpAction);
                
                    this.inJump = true;
         
            }
        }
    
        if (direction.magSqr() > 0) {
            direction.normalize();
            let newPosition = this.node.position.add(direction.multiplyScalar(this.speed * dt));
            this.node.setPosition(newPosition);
        }

        this.inJump = false;
    }
}
