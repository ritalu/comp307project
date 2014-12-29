package finalstudy;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
 
 
 
public class NumberBox
{
        Lock aLock = new ReentrantLock();
        Condition aCondition = aLock.newCondition();
       
        private int i = 0;
        public void increment()
        {
                aLock.lock();
                i++;
                aCondition.signalAll();
                aLock.unlock();
        }
        public int getI()
        {
                aLock.lock();
                try{
                return i;
                }
                finally
                {
                        try {
                                aCondition.await();
                        } catch (InterruptedException e) {
                                e.printStackTrace();
                        }
                        aLock.unlock();
                }
        }
       
        public static void main(String[] args)
        {
                NumberBox nb = new NumberBox();
                Thread ni = new Thread(new NumberIncrementer(nb));
                Thread np = new Thread(new NumberPrinter(nb));
                ni.start();
                np.start();
 
                /*try
                {
                        np.join();
                        ni.interrupt();
                }
                catch (InterruptedException e)
                {
                        e.printStackTrace();
                }*/
        }
}
 
class NumberIncrementer implements Runnable
{
        NumberBox nb;
        public NumberIncrementer(NumberBox pNb)
        {
                nb = pNb;
        }
        public void run()
        {
                while(true)
                {
                        nb.increment();
                        try
                        {
                                Thread.sleep(10);
                        }
                        catch (InterruptedException e)
                        {
                                return;
                        }
                        if (Thread.interrupted())
                        {
                                return;
                        }
                }
        }
}
 
class NumberPrinter implements Runnable
{
        NumberBox nb;
        public NumberPrinter(NumberBox pNb)
        {
                nb = pNb;
        }
        public void run()
        {
                for (int i = 0; i < 100; i++)
                {
                       
                        System.out.println(nb.getI());
                }
        }
}