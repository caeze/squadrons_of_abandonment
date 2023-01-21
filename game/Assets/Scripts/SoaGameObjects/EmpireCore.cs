using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EmpireCore : Building {
    
    void Start() {
        Debug.Log(this.GetType().Name + " started");
        base.setMaterial("green");
        base.addMeshCollider();
    }

    void Update() {
        
    }
}
