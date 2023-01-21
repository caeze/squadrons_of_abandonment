using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public interface MouseClickListener {
    void groundPlaneClicked(Vector3 positionInWorld);
    void gameObjectClicked(GameObject gameObject, Vector3 positionInWorld);
}