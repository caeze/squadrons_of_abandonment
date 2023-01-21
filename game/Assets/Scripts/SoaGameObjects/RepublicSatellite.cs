using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RepublicSatellite : Unit {
    
    void Start() {
        Debug.Log(this.GetType().Name + " started");
        base.setMaterial("red");
        base.addMeshCollider();
    }

    void Update() {
        
    }
}
