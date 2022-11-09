using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EmpireCore : Building {
    
    void Start() {
        Debug.Log(this.GetType().Name + " component starting with parent game object " + gameObject);
        Debug.Log(this.GetType().Name + " started.");
    }

    void Update() {
        
    }
}
