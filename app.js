var app = new Vue({
	el: '#app',
	data: {
		stack: [],
		table: [[],[],[],[],[],[],[],[],[],[]],
		home: [[],[],[],[],[],[],[],[]],
		hand: {x: 0, y: 0, pile: [], originPile: null, grabbed: false},
		droppable: []
	},
	methods: {
		deal: function () {
			if (this.hand.originPile != null) {
				this.unGrab();
			}
			for (pile of this.table) {
				if (pile.length == 0) return;
			}
			for (pile_index = 0 ; pile_index < this.table.length ; pile_index++) {
				if ( this.stack.length > 0) {
					var currentCard = this.stack.pop();
					currentCard.face = 'up';
					this.table[pile_index].push(currentCard);
				}
			}
		},
		grab: function (pile, card, event) {
			if (this.hand.originPile == null) {
				if (this.canGrab(pile, card)) {
					this.hand.x = event.clientX - event.layerX;
					this.hand.y = event.clientY - event.layerY;
					this.hand.originPile = pile;
					var found = false
					while( (pile.length > 0) && !found) {
						if (pile[pile.length - 1] == card) found = true;
						this.hand.pile.unshift(pile.pop());
					}
				} 
			} else {
				if (this.canDrop(pile)) {
					while(this.hand.pile.length > 0) {
						pile.push(this.hand.pile.shift());
					}
					if (this.hand.originPile.length > 0) {
						this.hand.originPile[this.hand.originPile.length - 1].face = 'up';
					}
					this.hand.originPile = null;
				} else {
					this.unGrab();
				}
			}

		},
		canGrab: function(pile, card) {
			var set = pile[pile.length - 1].set;
			var number = pile[pile.length - 1].number;
			var index = pile.length;
			while(index--) {
				if ( pile[index].face == 'down' ) return false;
				if ( pile[index].set != set) return false;
				if ( pile[index].number != number++) return false;
				if ( pile[index] == card ) return true;
			}
			return false;
		},
		canDrop: function (pile) {
			if (this.hand.pile.length == 0) return false;
			if (pile.length == 0) return true;
			if (pile[pile.length - 1].number == this.hand.pile[0].number + 1) return true;
			return false;
		}, 
		unGrab: function() {
			while(this.hand.pile.length > 0) {
				this.hand.originPile.push(this.hand.pile.shift());
			}
			this.hand.originPile = null;
		},
		drop: function (pile) {
			if (this.hand.pile.length == 0) return;
			while(this.hand.pile.length > 0) {
				pile.push(this.hand.pile.shift());
			}
			if (this.hand.originPile.length > 0) {
				this.hand.originPile[this.hand.originPile.length - 1].face = 'up';
			}
			this.hand.originPile = null;
		},
		homeDrop(pile) {
			if ((pile.length > 0) || (this.hand.pile.length !=  13)) return;
			this.drop(pile);
		}
	},
	mounted: function () {
		for (set of ['♠', '♥', '♦', '♣','♠', '♥', '♦', '♣']) {
			for (number = 1 ; number < 14 ; number++) {
				this.stack.push({set,number,face: 'down'});
			}
		}
		for (currentIndex = this.stack.length ; currentIndex >= 0 ; currentIndex--) {
			var random_index = Math.floor(Math.random() * currentIndex);
			var card = this.stack[random_index];
			this.stack.splice(random_index, 1);
			this.stack.push(card);
		}
		for (pile_index = 0 ; pile_index < this.table.length ; pile_index++) {
			for (down_count = 0 ; down_count < ( pile_index % 3 == 0 ? 5 : 4) ; down_count++) {
				this.table[pile_index].push(this.stack.pop());
			}
		}
		this.deal();
	}
});