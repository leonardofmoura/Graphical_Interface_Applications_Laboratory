

class MyMath {
    /**
	 * @method calcDistance
	 * Calculates distance between p1 and p2
	 * @param {Array} p1 - First point to calculate distance 
	 * @param {Array} p2 - Second point to calculate distance
	 */
    static calcDistance(p1,p2) {
		//return Math.sqrt(Math.pow(this.p1[0]-this.p2[0],2) + Math.pow(this.p1[1]-this.p2[1],2) + Math.pow(this.p1[2]-this.p2[2],2));
		//This is the old more complicated way

		return Math.hypot(p1[0]-p2[0],p1[1]-p2[1],p1[2]-p2[2]);
	}

	/**
	 * @method calcVector
	 * Returns the vector p1->p2
	 * @param {Array} p1 - Initial point of the vector
	 * @param {Array} p2 - Final point of the vector
	 */
	static calcVector(p1,p2) {
		var vec = [];
		for (var i = 0; i < 3; i++) {
			vec.push(p2[i]-p1[i]);
		}

		return vec;
	}
	
	/**
	 * @method calcCrossPorduct
	 * Returns the cross product v1 * v2
	 * @param {Array} v1 - First vector
	 * @param {Array} v2 - Second vector
	 */
	static calcCrossPorduct(v1,v2) {
		//lets assume r as the result vector
		var rx = v1[1]*v2[2] - v1[2]*v2[1];
		var ry = v1[2]*v2[0] - v1[0]*v2[2];
		var rz = v1[0]*v2[1] - v1[1]*v2[0];

		return [rx,ry,rz];
	}

	/**
	 * @method normalizeVec
	 * Returns a new vector corresponding to the v, but with norm 1
	 * @param {Array} v - Vector to normalize
	 */
	static normalizeVec(v) {
		var norm = Math.hypot(v[0],v[1],v[2]);

		return [v[0]/norm,v[1]/norm,v[2]/norm];
	}
}