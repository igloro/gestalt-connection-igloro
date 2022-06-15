const app = Vue.createApp({

  
  data() {
    return {
      container: '',
      started: false,
      movemenSize: 32,
      x: 10,
      y: 5,
      size_x: 21,
      size_y: 10, 
      timeStart: 0,
      timeEnd: 99999999,
      countElements: 0,
      opacity: 100,
      monsters: [],
      isDead: true,
      healthInc: 9,
      speed: 3500,
      iteration: 0,

      file: "toasty.mp3",
      fileB: "tPORt - Graphic Conveyer 2.4crk.mp3",

      sms_alerts: [],
      distractions: [],

      dialog: false,
    };
  },
  methods: {
    showElement() {
      
    },
    startGame() {

      if(!this.started)
      {
        this.doStart();

        this.monsters = [];
        this.speed = 3500;
        this.iteration = 0;
        this.started = true;
        this.isDead = false;
        this.opacity = 100;
        this.countElements = 0;

        this.sms_alerts = [];

        this.showPosition();
      }

    },
    moveLeft() {

      if(this.x - 1 > -1 && ! this.isDead)
      {  
        this.x--;
        this.checkPosition()
      }
    },
    moveRight() {

      if(this.x + 1 < this.size_x - 1 && ! this.isDead)
      {  
        this.x++;
        this.checkPosition();
      }
    },
    moveUp() {

      if(this.y - 1 > -1 && ! this.isDead)
      {
        this.y--;
        this.checkPosition();
      }
    },
    moveDown() {

      if(this.y + 1 < this.size_y && ! this.isDead)
      {
        this.y++;
        this.checkPosition();
      }
    },
    checkPosition() {

      found = false;

      this.monsters.forEach((monster, key) => {

        if(monster.x == this.x && monster.y == this.y)
        {
          found = true;
          this.monsters.splice(key, 1);
        }
      });

      if(found) {
        this.speed = Math.floor(this.speed + (this.speed / 10));
        this.iteration++;
        this.increaseHealth();

        this.countElements--;

        var randPlay = Math.random();

        if(randPlay < 0.10) // 10%
        {
          this.toggleSound()
        }
        else if(randPlay < 0.80) // 10-80 = 70%
        {
          this.addDistraction();
        }
        else 
        {
          //nothing 
        }
      }



    },
    increaseHealth() {
      //this.opacity += this.healthInc;
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    },
    decreaseHealth() {
      //this.opacity -= this.healthInc;
    },
    showPosition() {

      let self = this; 

      if(this.countElements < 10)
      {
        this.speed = Math.floor(this.speed - (this.speed / 10));

        

        emptyFound = false;

        var iterations = 0;

        while( !emptyFound ) {

          getRandom_x = this.getRandomInt(this.size_x - 1);
          getRandom_y = this.getRandomInt(this.size_y - 1);

          //getRandom_x = this.getRandomInt(4);
          //getRandom_y = this.getRandomInt(4);


          var foundMonster = false;

          this.monsters.forEach((monster, key) => {

            if( (getRandom_x == this.x && getRandom_y == this.y) || ( getRandom_x == monster.x && getRandom_y == monster.y ) )
            {
              foundMonster = true;
            }
          });


          if(!foundMonster) {
            this.monsters.push({x: getRandom_x, y: getRandom_y});
            emptyFound = true;
          }


          iterations++;
          if(iterations > 1000) break;
        }

        var positionLoop = setTimeout(function () { self.showPosition() } , this.speed);
        this.countElements++;

        this.decreaseHealth();

      }
      else 
      {
        this.isDead = true;
        this.opacity = 100;
        this.started = false;
        
        this.doStop();
      }
      

    },

    addDistraction() {

      var randDistraction = Math.random();

      // 50/50%
      if(randDistraction < 0.5)
      {
        this.addDistractionConfirm();
      } 
      else
      {
        this.addDistractionAlert();
      } 

    },
    removeDist(x, y, a) {


      if(! this.isDead)
      {
        var answer_good = false;
        this.distractions.forEach((dist, key) => {

          if(dist.x == x && dist.y == y)
          {
            console.log(dist.a + " " + a);
            if(dist.a == a) {
              answer_good = true;
            }

            this.distractions.splice(key, 1);
          }

        });

        if(!answer_good) {
          
          let audio3 = this.$refs.audio3;      
          audio3.play();
          
          this.speed -= 50;
        }
      }

    },
    removeSMS(x, y) {
      
      if(! this.isDead)
      {

        this.sms_alerts.forEach((sms, key) => {

          if(sms.x == x && sms.y == y)
          {
            this.sms_alerts.splice(key, 1);
          }
        });
      }


    },
    addDistractionConfirm() {

      var distractionsPrep = [
        {q:'How was your day today?', a: 'Good', ba: 'F.off' },
        {q:'7 * 5 = ?', a: '35', ba: '45' },
        {q:'3 * 5 = ?', a: '15', ba: '45' },
        {q:'5 * 5 = ?', a: '25', ba: '45' },
        {q:'4 * 5 = ?', a: '20', ba: '25' },
        {q:'6 * 5 = ?', a: '30', ba: '25' },
        {q:'8 * 5 = ?', a: '40', ba: '25' },
        {q:'231 * 200 = ?', a: '42600', ba: '44600' },
        {q:'223 * 200 = ?', a: '44600', ba: '42600' },
        {q:'Hey. How are you?', a: 'Hey! Im fine, and you?', ba: '*Ignore*' },
      ];

      var selectedDist = distractionsPrep[Math.floor(Math.random() * distractionsPrep.length)];

      this.distractions.push({
        'x': this.getRandomInt(this.size_x * this.movemenSize - 30), 
        'y': this.getRandomInt(this.size_y * this.movemenSize - 40), 
        'q': selectedDist.q,
        'a': selectedDist.a,
        'ba': selectedDist.ba,
        'pos': this.getRandomInt(1)
      });
      

    },
    addDistractionAlert() {

      var smsPrep = [
        'Hey. How are you?',
        'You coming?',
        'Call me ASAP?',
        'I miss you',
        'Verification code: 1337',
        'ATM withdrawal. Advanced BANK 9952 SFOGEAR BLW **** 8787 $250 AUT: 3767',
      ];
      
      this.sms_alerts.push({'x': this.getRandomInt( (this.size_x * this.movemenSize - 30) ), 'y': this.getRandomInt(this.size_y * this.movemenSize - 40), 't': smsPrep[Math.floor(Math.random() * smsPrep.length)]});
      

    },
    doStart() {

      let audio = this.$refs.audio2;      
      audio.play();
      
    },
    doStop() {

      let audio = this.$refs.audio2;  
      audio.pause();

    },
    toggleSound() {

      let audio = this.$refs.audio;      
      audio.play();
    }

  },
  mounted() {

    let self = this; 
    
  
    window.addEventListener('keyup', function(ev) {

        if(ev.key == "ArrowLeft" || ev.key == "a") {
          self.moveLeft()
        }
        else if(ev.key == "ArrowRight" || ev.key == "d") {
          self.moveRight()
        }
        else if(ev.key == "ArrowUp" || ev.key == "w") {
          self.moveUp()
        }
        else if(ev.key == "ArrowDown" || ev.key == "s") {
          self.moveDown()
        }
    });
  },
  

  
});

app.mount('#game');




