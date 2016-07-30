import compose, { ComposeFactory } from 'dojo-compose/compose';

export interface Point { c: number; r: number; }
export function createPoint(c: number, r: number): Point {
    return <Point> {
        c: c,
        r: r
    };
}

export interface Rectangle {
    topLeft: Point;
    bottomRight: Point;
    contains(point: Point): boolean;
    intersects(other: Rectangle): boolean;
    moveHorizontal(distance: number): Rectangle;
    moveVertical(distance: number): Rectangle;
}

export interface RectangleOptions {
    topLeft?: Point;
    bottomRight?: Point;
}


const createRectangle: ComposeFactory<Rectangle, RectangleOptions> = compose<Rectangle, RectangleOptions>({
    topLeft: createPoint(-1, -1),
    bottomRight: createPoint(-1, -1),
    contains(point:Point) {
        const rectangle = <Rectangle> this;
        return this.topLeft.c <= point.c && point.c <= this.bottomRight.c &&
            this.topLeft.r <= point.r && point.r <= this.bottomRight.r
    },

    intersects(other:Rectangle) {
        const rectangle = <Rectangle> this;
        return rectangle.bottomRight.c >= other.topLeft.c && rectangle.bottomRight.r >= other.topLeft.r &&
            other.bottomRight.c >= rectangle.topLeft.c && other.bottomRight.r >= rectangle.topLeft.r
    },

    moveHorizontal(distance: number) {
        const rectangle = <Rectangle> this;
        return createRectangle({
            topLeft: {
                c: rectangle.topLeft.c + distance,
                r: rectangle.topLeft.r
            },
            bottomRight: {
                c: rectangle.bottomRight.c + distance,
                r: rectangle.bottomRight.r
            }
        });
    },

    moveVertical(distance: number) {
        const rectangle = <Rectangle> this;
        return createRectangle({
            topLeft: {
                c: rectangle.topLeft.c,
                r: rectangle.topLeft.r + distance
            },
            bottomRight: {
                c: rectangle.bottomRight.c,
                r: rectangle.bottomRight.r + distance
            }
        });
    }
}, function(instance: Rectangle, options: RectangleOptions) {
    if (options.topLeft) {
        instance.topLeft = options.topLeft;
    } else {
        instance.topLeft = createPoint(-1, -1);
    }

    if (options.bottomRight) {
        instance.bottomRight = options.bottomRight;
    } else {
        instance.bottomRight = createPoint(-1, -1)
    }
});

export default createRectangle;
